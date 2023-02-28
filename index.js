require('dotenv').config()
const { Markup } = require('telegraf')
const userController = require('./controllers/user.controller')
const advertisementService = require('./server/services/advertisement.service')
const cityService = require("./server/services/city.service");
const channelService = require('./server/services/channel.service')
const userService = require('./server/services/user.service')
const chatService = require('./server/services/chat.service')
const bot = require('./telgram/telegram')
const chatDataService = require("./server/services/chatData.service");
const teamService = require('./server/services/team.service')
const requestRateService = require('./server/services/requestRate.service')

bot.telegram.setMyCommands( [{ command: 'menu', description: 'Open menu buttons' }, { command: 'start', description: 'Start the bot' }])

bot.start(async (ctx) => {
    try{
        const registration = await userController.start(ctx.update.message.from)
        const chatId = ctx.update.message.from.id

        if(registration)
            await sendMessageWithKeyboard(chatId, "Вітаю! Ви успішно зареєстровані як користувач!")
        else
            await sendMessageWithKeyboard(chatId, "Ви вже зареєстровані!")
    }catch (e) {
        console.log('error: ', e)
    }
})

bot.hears('Канали', async (ctx)=>{
   try{
       const chatId = ctx.update.message.from.id

       // await ctx.telegram.deleteMessage(chatId, ctx.update.message.message_id)
       const user =  await userService.getUserByTelegramId(chatId)
       const accessToMenu = await userController.accessToMenu(chatId)

       if(user.isBlocked || !accessToMenu){
           return await sendMessageWithKeyboard(ctx.update.message.from.id, 'У вас немає доступу!')
       }

       const team = await teamService.findByTeamId(user.teamId)

       const channel = await channelService.getByLeagueId(team.leagueId)

       let channelsList = 'Ваші канали:\n' + `${channel.URL}`

       await sendMessageWithKeyboard(chatId, channelsList)

   }catch (e) {
       console.log('error: ', e)
   }
})

bot.hears('Мої оголошення', async (ctx)=> {
    try{
        const chatId = ctx.update.message.from.id

        // await ctx.telegram.deleteMessage(chatId, ctx.update.message.message_id)
        const user =  await userService.getUserByTelegramId(chatId)
        const accessToMenu = await userController.accessToMenu(chatId)

        if(user.isBlocked || !accessToMenu){
            return await sendMessageWithKeyboard(ctx.update.message.from.id, 'У вас немає доступу!')
        }

        const advertisements = await advertisementService.getAllByTelegramId(chatId)
        await sendMessageWithKeyboard(chatId, "Ваші оголошення: ")

        for (let advertisementsKey in advertisements) {
            await showAdvertisement(advertisements[advertisementsKey], chatId)
        }
    }catch (e) {
        console.log('error: ', e)
    }
})

bot.action('delete_advertisement', async (ctx) => {
    try{
        const number = Number(ctx.update.callback_query.message.text.split(' ')[1].split('\n')[0].slice(1))
        await advertisementService.deleteByNumber(number)
        await ctx.telegram.deleteMessage(ctx.update.callback_query.message.chat.id, ctx.update.callback_query.message.message_id)
    }catch (e) {
        console.log('error: ', e)
    }
})

bot.hears('Додати оголошення', async (ctx)=> {
    try{
        const chatId = ctx.update.message.from.id

        // await ctx.telegram.deleteMessage(chatId, ctx.update.message.message_id)
        const user =  await userService.getUserByTelegramId(chatId)
        const accessToMenu = await userController.accessToMenu(chatId)

        if(user.isBlocked || !accessToMenu){
            return await sendMessageWithKeyboard(ctx.update.message.from.id, 'У вас немає доступу!')
        }

        await sendMessageWithKeyboard(chatId, "...")
        await ctx.reply('Заповніть форму',
            Markup.inlineKeyboard([
                Markup.button.webApp('Заповнити', `${process.env.ADVERTISEMENT_CREATE_URL}`)
            ])
        )

    }catch (e) {
        console.log('error: ', e)
    }
})

bot.action('create_chat', async (ctx)=> {
    try{
        const chatId = ctx.update.callback_query.from.id

        const number = Number(ctx.update.callback_query.message.text.split(' ')[1].split('\n')[0].slice(1))
        const advertisement = await advertisementService.getByNumber(number)

        if(!advertisement)return await sendMessageWithKeyboard(chatId, "Щось пішло не так!")

        const userClient = await userService.getUserByTelegramId(chatId)
        const userCustomer = await userService.getUserById(advertisement.userId)

        if(userCustomer._id.toString() === userClient._id.toString()){
            return await sendMessageWithKeyboard(chatId, 'Ви не можете писати повідомлення самі собі !')
        }
        const candidat = await chatService.getByClientIdAndAdvertisementId(userClient._id, advertisement._id)

        if(candidat){
            return await ctx.telegram.sendMessage(userClient.telegramId,`Ви вже відповідали на це замовлення\n\nВідповісти на замовлення №${number}`, Markup.inlineKeyboard([
                [Markup.button.webApp(`Відповісти`, `${process.env.CHAT_URL}/chat?name=client&room=${candidat.room}`)],
                [Markup.button.callback('Видалити чат', 'delete_chat')]
                ])
            )
        }

        const chat = await chatService.create(advertisement._id, advertisement.userId, userClient._id, true)

        {
            const cityName = await cityService.findById(advertisement.cityId)
            let chatData = await chatDataService.create(chat.room, "Admin", `Оголошення №${advertisement.number}`)
            chatData = await chatDataService.create(chat.room, "Admin", `${advertisement.type}: ${advertisement.total}USDT trc20`)
            chatData = await chatDataService.create(chat.room, "Admin", `Місто: ${cityName.name}`)
            chatData = await chatDataService.create(chat.room, "Admin", `Частин: ${advertisement.part}`)
            chatData = await chatDataService.create(chat.room, "Admin", `Ставка: ${advertisement.rate}%`)
            chatData = await chatDataService.create(chat.room, "Admin", `Дійсне до: ${advertisement.deadline}`)

        }

        await ctx.telegram.sendMessage(userClient.telegramId,`Відповісти на замовлення №${number}`, Markup.inlineKeyboard([
            [Markup.button.webApp(`Відповісти`, `${process.env.CHAT_URL}/chat?name=client&room=${chat.room}`)],
            [Markup.button.callback('Видалити чат', 'delete_chat')]
            ])
        )

        await ctx.telegram.sendMessage(userCustomer.telegramId, `Чат #${chat.number}\n\nХтось хоче вам відповісти на замовлення №${number}`, Markup.inlineKeyboard([[
                Markup.button.webApp(`Відповісти`, `${process.env.CHAT_URL}/chat?name=customer&room=${chat.room}`)
            ],
            [
                Markup.button.callback(`Бронювати`, `accept_reserve_advertisement`),
                Markup.button.callback(`Фіксувати`, `accept_fix_advertisement`),
            ],
            [Markup.button.callback('Видалити чат', 'delete_chat')]])
        )
    }catch (e){
        console.log('error: ', e)
    }

})

bot.action('send_rate_request', async (ctx)=> {
    try{
        const chatId = ctx.update.callback_query.from.id

        const number = Number(ctx.update.callback_query.message.text.split(' ')[1].split('\n')[0].slice(1))
        const advertisement = await advertisementService.getByNumber(number)

        if(!advertisement)return await sendMessageWithKeyboard(chatId, "Щось пішло не так!")

        if(advertisement.statusStage !== "open"){
            if(advertisement.statusStage === "fixed"){
                return await sendMessageWithKeyboard(chatId, "Це оголошення вже зафіксоване, спробуйте пізніше або пошукайте інше!")
            }else
            if(advertisement.statusStage === "reserved"){
                return await sendMessageWithKeyboard(chatId, "Це оголошення вже зарезервоване, спробуйте пізніше або пошукайте інше!")
            }else{
                return await sendMessageWithKeyboard(chatId, "Щось пішло не так!")
            }
        }

        const userClient = await userService.getUserByTelegramId(ctx.update.callback_query.from.id)
        const userCustomer = await userService.getUserById(advertisement.userId)

        if(userCustomer._id.toString() === userClient._id.toString()){
            return await sendMessageWithKeyboard(chatId, 'Ви не можете запропунувати ціну самі собі !')
        }

        const chat = await chatService.create(advertisement._id, advertisement.userId, userClient._id, false)

        await ctx.telegram.sendMessage(userClient.telegramId,`Запропунувати ціну на замовлення №${number}`, Markup.inlineKeyboard([
                Markup.button.webApp(`Відповісти`, `${process.env.ADVERTISEMENT_CREATE_URL}/rate/?chatId=${chat._id}&advertisementId=${advertisement._id}`),// requestRAte, advertId
                Markup.button.callback('Скасувати', 'cancel_action')
            ])
        )
    }catch (e){
        console.log('error: ', e)
    }

})

bot.action('cancel_action', async (ctx)=> {
    try{
        await ctx.telegram.deleteMessage(ctx.update.callback_query.message.chat.id, ctx.update.callback_query.message.message_id)
    }catch (e){
        console.log('error: ', e)
    }

})

bot.action('accept_rate', async (ctx)=> {
    try{
        const chatId = ctx.update.callback_query.from.id
        let requestRateNumber = Number(ctx.update.callback_query.message.text.split('\n')[0].split(' ')[1].slice(1))

        console.log({requestRateNumber})

        const advertisementNumber = Number(ctx.update.callback_query.message.text.split('\n')[1].split(' ')[10].slice(1))
        const advertisement = await advertisementService.getByNumber(advertisementNumber)

        if(!advertisement || !requestRateNumber)return await sendMessageWithKeyboard(chatId, "Щось пішло не так!")

        const requestRate = await requestRateService.findByNumber(requestRateNumber, advertisement._id)
        let chat = await chatService.findById(requestRate.chatId)

        const userClient = chat.clientId
        const userCustomer = chat.customerId

        //delete requestRate
        await requestRateService.deleteByNumber(requestRateNumber, advertisement._id)
        chat = await chatService.acceptedToTrue(chat._id)

        await ctx.telegram.sendMessage(userClient,`Вашу ставку на замовлення №${advertisementNumber} одобрили`, Markup.inlineKeyboard([
                Markup.button.webApp(`Перейти до чату`, `${process.env.CHAT_URL}/chat?name=client&room=${chat.room}`),
            ])
        )

        await ctx.telegram.sendMessage(userCustomer, `Ви одобрили ставку на замовлення №${advertisementNumber}`, Markup.inlineKeyboard([
                Markup.button.webApp(`Перейти до чату`, `${process.env.CHAT_URL}/chat?name=customer&room=${chat.room}`)
            ])
        )

    }catch (e){
        console.log('error: ', e)
    }

})

bot.action('cancel_rate', async (ctx)=> {
    try{
        const chatId = ctx.update.callback_query.from.id
        //data to delete requestRate and chat
        let requestRateNumber = Number(ctx.update.callback_query.message.text.split(' ')[1].slice(1))

        const advertisementNumber = Number(ctx.update.callback_query.message.text.split('\n')[1].split(' ')[10].slice(1))
        const advertisement = await advertisementService.getByNumber(advertisementNumber)

        if(!advertisement || !requestRateNumber)return await sendMessageWithKeyboard(chatId, "Щось пішло не так!")

        const requestRate = await requestRateService.findByNumber(requestRateNumber, advertisement._id)
        let chat = await chatService.findById(requestRate.chatId)

        //data to send notification of canceling
        const userClient = chat.clientId
        const userCustomer = chat.customerId

        //send notification to users
        await sendMessageWithKeyboard(userClient, `Вашу ставку на замовлення №${advertisementNumber} скасували`)

        await sendMessageWithKeyboard(userCustomer, `Ви успішно скасували ставку на замовлення №${advertisementNumber}`)

        //delete chat
        chat = await chatService.delete(requestRate.chatId)

        //delete requestRate
        await requestRateService.deleteByNumber(requestRateNumber, advertisement._id)

    }catch (e){
        console.log('error: ', e)
    }

})

bot.hears('Мої чати', async (ctx)=>{
    try{
        const chatId = ctx.update.message.from.id
        // await ctx.telegram.deleteMessage(chatId, ctx.update.message.message_id)

        const userAuth =  await userService.getUserByTelegramId(chatId)
        const accessToMenu = await userController.accessToMenu(chatId)
        if(userAuth.isBlocked || !accessToMenu){
            return await sendMessageWithKeyboard(chatId, 'У вас немає доступу!')
        }

        const user = await userService.getUserByTelegramId(ctx.update.message.from.id)
        const customerChats = await chatService.getAllByCustomerId(user._id)
        if(customerChats.length)
            await sendMessageWithKeyboard(chatId, "Писали вам :")

        for (let chatsKey in customerChats) {
            const advertisement = await advertisementService.getById(customerChats[chatsKey].advertisementId)

            let buttonFixed = 'Фіксувати',
                callbackButtonFixed = 'accept_fix_advertisement',
                buttonReserved = 'Бронювати',
                callbackButtonReserved = 'accept_reserve_advertisement'

            if(advertisement.statusStage !== "open"){
                if(advertisement.statusStage === "fixed"){
                    buttonFixed = 'Зняти фіксацію'
                    callbackButtonFixed = 'accept_open_advertisement'
                }else
                if(advertisement.statusStage === "reserved"){
                    buttonReserved = 'Зняти резирвацію'
                    callbackButtonReserved = 'accept_open_advertisement'
                }else{
                    return await sendMessageWithKeyboard(chatId, "Щось пішло не так!")
                }
            }

            await bot.telegram.sendMessage(ctx.update.message.from.id, `Чат #${customerChats[chatsKey].number}\n\nЛистування щодо оголошення №${advertisement.number}`, Markup.inlineKeyboard([[
                Markup.button.webApp(`Написати`, `${process.env.CHAT_URL}/chat?name=customer&room=${customerChats[chatsKey].room}`)],
                [
                    Markup.button.callback(`${buttonReserved}`, callbackButtonReserved),
                    Markup.button.callback(`${buttonFixed}`, callbackButtonFixed),
                ],
                [Markup.button.callback('Видалити чат', 'delete_chat')],
                [Markup.button.callback('Викликати арбітраж', 'report')],
                [Markup.button.callback('Позначити угоду як завершену успішно', 'report')]])
            )
        }

        const clientChats = await chatService.getAllByClientId(user._id)
        if(clientChats.length)
            await sendMessageWithKeyboard(chatId, "Писали ви :")

        for (let chatsKey in clientChats) {
            const advertisement = await advertisementService.getById(clientChats[chatsKey].advertisementId)
            await bot.telegram.sendMessage(ctx.update.message.from.id, `Листування щодо оголошення №${advertisement.number}`, Markup.inlineKeyboard([[
                Markup.button.webApp(`Написати`, `${process.env.CHAT_URL}/chat?name=client&room=${clientChats[chatsKey].room}`)],
                [Markup.button.callback('Видалити чат', 'delete_chat')],
                [Markup.button.callback('Викликати арбітраж', 'report')],
                [Markup.button.callback('Позначити угоду як завершену успішно', 'report')]])
            )
        }
    }catch (e){
        console.log('error: ', e)
    }
})

bot.hears('Мої пропозиції', async (ctx)=>{
    try{
        const chatId = ctx.update.message.from.id
        // await ctx.telegram.deleteMessage(chatId, ctx.update.message.message_id)

        const userAuth =  await userService.getUserByTelegramId(chatId)
        const accessToMenu = await userController.accessToMenu(chatId)
        if(userAuth.isBlocked || !accessToMenu){
            return await sendMessageWithKeyboard(chatId, 'У вас немає доступу!')
        }
        const user = await userService.getUserByTelegramId(chatId)

        const requestChats = await chatService.findAllRequestsByUserId(user._id)

        if(requestChats.length === 0 )
            return sendMessageWithKeyboard(chatId, "У вас немає жодних пропозицій!")

        await sendMessageWithKeyboard(chatId, "Ваші пропозиції :")

        for (let chatsKey in requestChats) {
            const advertisement = await advertisementService.getById(requestChats[chatsKey].advertisementId)
            if(advertisement)
            await bot.telegram.sendMessage(ctx.update.message.from.id, `Ви пропонуєте ${requestChats[chatsKey].rate}% на оголошенням №${advertisement.number}`)
            else
                console.log({advertisement}, {id: requestChats[chatsKey].advertisementId})

        }
    }catch (e){
        console.log('error: ', e)
    }
})

bot.action('show_requests_rate', async (ctx)=> {
    try{
        const chatId = ctx.update.callback_query.from.id
        const numberAdvertisement = ctx.update.callback_query.message.text.split('\n')[0].split(' ')[1].slice(1)
        const advertisement = await advertisementService.getByNumber(numberAdvertisement)
        const requestsRate = await requestRateService.getByAdvertisementId(advertisement._id)

        if(requestsRate.length == 0 ){
            return await sendMessageWithKeyboard(chatId, `Запитів на оголошення №${numberAdvertisement} не знайдено`)
        }

        await sendMessageWithKeyboard(chatId, `Всі запити на оголошення №${numberAdvertisement}`)

    for (let requestsRateKey in requestsRate) {
        const chat = await chatService.findById(requestsRate[requestsRateKey].chatId)
        const userClient = await userService.getUserById(chat.clientId)
        const teamClient = await teamService.findByTeamId(userClient.teamId)

        await bot.telegram.sendMessage(chatId, `Запит №${requestsRate[requestsRateKey].number} : \n`+
            `Користувач з команди ${teamClient.name} пропунує ставку ${requestsRate[requestsRateKey].rate} на вашу заявку №${advertisement.number}`,
            Markup.inlineKeyboard([
                Markup.button.callback(`Прийняти`, `accept_rate`),
                Markup.button.callback(`Відмовити`, `cancel_rate`)
            ]))


    }


    }catch (e){
        console.log('error: ', e)
    }

})

bot.action('show_advertisement_chats', async (ctx)=> {
    try{
        const chatId = ctx.update.callback_query.from.id
        const numberAdvertisement = ctx.update.callback_query.message.text.split('\n')[0].split(' ')[1].slice(1)
        const advertisement = await advertisementService.getByNumber(numberAdvertisement)

        await showAllChatsByAdvertisementId(advertisement._id, chatId)

    }catch (e){
        console.log('error: ', e)
    }

})

bot.hears('/menu', async (ctx)=>{
    try{
        const chatId = ctx.update.message.from.id
        await ctx.telegram.deleteMessage(chatId, ctx.update.message.message_id)

        await sendMessageWithKeyboard(chatId, 'menu : ')
    }catch (e) {
        console.log('error: ', e)
    }
})

bot.action('fix_advertisement', async (ctx)=> {
    try{
        const chatId = ctx.update.callback_query.from.id

        const numberAdvertisement = ctx.update.callback_query.message.text.split('\n')[0].split(' ')[6].slice(1)
        const numberChat = ctx.update.callback_query.message.text.split('\n')[0].split(' ')[3].slice(1)

        let advertisement = await advertisementService.getByNumber(numberAdvertisement)

        const chat = await chatService.getByNumberAndAdvertisementId(numberChat, advertisement._id)
        advertisement = await advertisementService.switchStatusStage(advertisement._id, 'fixed', chat._id)

        bot.telegram.deleteMessage(chatId, ctx.update.callback_query.message.message_id)

        ctx.reply('Чат успішно зафіксовано!')


    }catch (e){
        console.log('error: ', e)
    }

})

bot.action('reserve_advertisement', async (ctx)=> {
    try{
        const chatId = ctx.update.callback_query.from.id

        const numberAdvertisement = ctx.update.callback_query.message.text.split('\n')[0].split(' ')[6].slice(1)
        const numberChat = ctx.update.callback_query.message.text.split('\n')[0].split(' ')[3].slice(1)

        let advertisement = await advertisementService.getByNumber(numberAdvertisement)

        const chat = await chatService.getByNumberAndAdvertisementId(numberChat, advertisement._id)
        advertisement = await advertisementService.switchStatusStage(advertisement._id, 'reserved', chat._id)

        bot.telegram.deleteMessage(chatId, ctx.update.callback_query.message.message_id)

        ctx.reply('Чат успішно зарезервовано!')

    }catch (e){
        console.log('error: ', e)
    }

})

bot.action('open_advertisement', async (ctx)=> {
    try{
        const chatId = ctx.update.callback_query.from.id

        const numberAdvertisement = ctx.update.callback_query.message.text.split('\n')[0].split(' ')[3].slice(1)

        let advertisement = await advertisementService.getByNumber(numberAdvertisement)

        advertisement = await advertisementService.switchStatusStage(advertisement._id, 'open', "000000000000000000000000")

        bot.telegram.deleteMessage(chatId, ctx.update.callback_query.message.message_id)

        ctx.reply('Чат успішно відкрито!')

    }catch (e){
        console.log('error: ', e)
    }

})

bot.action('accept_reserve_advertisement', async (ctx)=> {
    try{
        const chatId = ctx.update.callback_query.from.id
        const numberAdvertisement = ctx.update.callback_query.message.text.split('\n')[2].split(' ')[3].slice(1)
        const numberChat = ctx.update.callback_query.message.text.split('\n')[0].split(' ')[1].slice(1)

        await bot.telegram.sendMessage(chatId, `Підтвердіть резервування чату #${numberChat} на оголошення №${numberAdvertisement}`,Markup.inlineKeyboard([
            Markup.button.callback('Підтвердити', 'reserve_advertisement'),
            Markup.button.callback('Сукасувати', 'cancel_action')
        ]))
    }catch (e){
        console.log('error: ', e)
    }

})

bot.action('accept_fix_advertisement', async (ctx)=> {
    try{
        const chatId = ctx.update.callback_query.from.id
        const numberAdvertisement = ctx.update.callback_query.message.text.split('\n')[2].split(' ')[3].slice(1)
        const numberChat = ctx.update.callback_query.message.text.split('\n')[0].split(' ')[1].slice(1)

        await bot.telegram.sendMessage(chatId, `Підтвердіть фіксування чату #${numberChat} на оголошення №${numberAdvertisement}`,Markup.inlineKeyboard([
            Markup.button.callback('Підтвердити', 'fix_advertisement'),
            Markup.button.callback('Сукасувати', 'cancel_action')
        ]))
    }catch (e){
        console.log('error: ', e)
    }

})

bot.action('accept_open_advertisement', async (ctx)=> {
    try{
        const chatId = ctx.update.callback_query.from.id
        const numberAdvertisement = ctx.update.callback_query.message.text.split('\n')[2].split(' ')[3].slice(1)

        await bot.telegram.sendMessage(chatId, `Підтвердіть відкритя оголошення №${numberAdvertisement}`,Markup.inlineKeyboard([
            Markup.button.callback('Підтвердити', 'open_advertisement'),
            Markup.button.callback('Сукасувати', 'cancel_action')
        ]))
    }catch (e1){
        try{
            const chatId = ctx.update.callback_query.from.id
            const numberAdvertisement = ctx.update.callback_query.message.text.split('\n')[0].split(' ')[1].slice(1)

            await bot.telegram.sendMessage(chatId, `Підтвердіть відкритя оголошення №${numberAdvertisement}`,Markup.inlineKeyboard([
                Markup.button.callback('Підтвердити', 'open_advertisement'),
                Markup.button.callback('Сукасувати', 'cancel_action')
            ]))
        }catch (e2) {
            console.log('error: ', e2)
        }
    }

})

bot.action('delete_chat', async (ctx)=> {
    try{
        const chatId = ctx.update.callback_query.from.id
        let text = ctx.update.callback_query.message.text.split(' ')
        const numberAdvertisement = text[text.length - 1].slice(1)

        const advertisement = await advertisementService.getByNumber(numberAdvertisement)
        const user = await userService.getUserByTelegramId(chatId)

        if(text[1][0] === '#'){
            const numberChat = text[1].split('\n')[0].slice(1)

            let chat = await chatService.getByNumberAndAdvertisementId(numberChat, advertisement._id)

            const userCustomer = await userService.getUserById(chat.customerId)
            const userClient = await userService.getUserById(chat.clientId)

            chat = await chatService.delete(chat._id)

            await sendMessageWithKeyboard(userCustomer.telegramId, `Чат #${numberChat} щодо оголошення №${numberAdvertisement} було успішно видалено!`)
            await sendMessageWithKeyboard(userClient.telegramId, `Чат щодо оголошення №${numberAdvertisement} було видалено співрозмовником!`)
        }else{
            let chat = await chatService.getByClientIdAndAdvertisementId(user._id, advertisement._id)

            const userCustomer = await userService.getUserById(chat.customerId)
            const userClient = await userService.getUserById(chat.clientId)

            chat = await chatService.delete(chat._id)

            await sendMessageWithKeyboard(userCustomer.telegramId, `Чат #${chat.number} щодо оголошення №${numberAdvertisement} було видалено співрозмовником!`)
            await sendMessageWithKeyboard(userClient.telegramId, `Чат щодо оголошення №${numberAdvertisement} було успішно видалено!`)
        }


    }catch (e){
       console.log('error: ', e)
    }

})

        // FUNCTIONS \\

async function sendMessageWithKeyboard(chatId, message){
    return bot.telegram.sendMessage(chatId, message, Markup
        .keyboard([
            ['Додати оголошення', 'Мої оголошення', 'Мої пропозиції'],
            ['Канали', 'Мої чати']
        ])
        .oneTime()
        .resize()
    )
}

async function showAllChatsByAdvertisementId(advertisementId, chatId){
    const user = await userService.getUserByTelegramId(chatId)
    const advertisement = await advertisementService.getById(advertisementId)

    console.log(user._id.toString() , advertisement.userId.toString())

    if(user._id.toString() !== advertisement.userId.toString()){
        return await sendMessageWithKeyboard(chatId, 'Щось пішло не так!')
    }

    const chats = await chatService.getAllByCustomerIdAndAdvertisementId(user._id, advertisement._id)

    if(chats.length === 0){
        return await sendMessageWithKeyboard(chatId,`Чати до оголошення №${advertisement.number} відсутні!`)
    }

    await sendMessageWithKeyboard(chatId,`Всі чати до оголошення №${advertisement.number} :`)

    let buttonFixed = 'Фіксувати',
        callbackButtonFixed = 'accept_fix_advertisement',
        buttonReserved = 'Бронювати',
        callbackButtonReserved = 'accept_reserve_advertisement'

    if(advertisement.statusStage !== "open"){
        if(advertisement.statusStage === "fixed"){
            buttonFixed = 'Зняти фіксацію'
            callbackButtonFixed = 'accept_open_advertisement'
        }else
        if(advertisement.statusStage === "reserved"){
            buttonReserved = 'Зняти резирвацію'
            callbackButtonReserved = 'accept_open_advertisement'
        }else{
            return await sendMessageWithKeyboard(chatId, "Щось пішло не так!")
        }
    }

    for (let chatsKey in chats) {
        await bot.telegram.sendMessage(chatId, `Чат #${chats[chatsKey].number}\n\nЛистування щодо оголошення №${advertisement.number}`, Markup.inlineKeyboard([[
            Markup.button.webApp(`Написати`, `${process.env.CHAT_URL}/chat?name=customer&room=${chats[chatsKey].room}`)],
            [
                Markup.button.callback(`${buttonReserved}`, callbackButtonReserved),
                Markup.button.callback(`${buttonFixed}`, callbackButtonFixed),
            ],
            [Markup.button.callback('Видалити чат', 'delete_chat')],
            [Markup.button.callback('Викликати арбітраж', 'report')],
            [Markup.button.callback('Позначити угоду як завершену успішно', 'report')]])
        )
    }


}

async function showAdvertisement(advertisementId, chatId){
    const advertisement = await advertisementService.getById(advertisementId)
    const city = await cityService.findById(advertisement.cityId)

    if(advertisement.statusStage !== 'open'){

        let button = 'Зняти бронювання',
            callbackButton = 'accept_open_advertisement'
        if(advertisement.statusStage === "reserved"){}else
        if(advertisement.statusStage === "fixed"){
                button = 'Зняти фіксацію'
            }else{
                return await sendMessageWithKeyboard(chatId, "Щось пішло не так!")
            }


        if(advertisement.rate == 0){
            let requestsRate = []
            requestsRate = await requestRateService.getByAdvertisementId(advertisement._id)

            await bot.telegram.sendMessage(chatId, `Оголошення №${advertisement.number }\n` +
                `${advertisement.type}: ${advertisement.total} USDT trc20\n` +
                `Місто: ${city.name}\n` +
                `Частин: ${advertisement.part}\n` +
                `Ставка: ${advertisement.rate}%\n` +
                `Дійсне до: ${advertisement.deadline}\n` +
                `${advertisement.extraInfo}\n` +
                `\n` +
                `У вас зараз [${requestsRate.length}] нових пропозицій`,
                Markup.inlineKeyboard([[
                    Markup.button.webApp(`Редагувати`, `${process.env.ADVERTISEMENT_REDACT_URL}${advertisement._id}`),
                    Markup.button.callback('Скасувати', 'delete_advertisement')
                ],
                    [Markup.button.callback('Переглянути пропозиції', 'show_requests_rate')],
                    [Markup.button.callback('Переглянути чати', 'show_advertisement_chats')],
                    [Markup.button.callback(`${button}`, callbackButton)]])
            )
        }else{
            await bot.telegram.sendMessage(chatId, `Оголошення №${advertisement.number }\n` +
                `${advertisement.type}: ${advertisement.total} USDT trc20\n` +
                `Місто: ${city.name}\n` +
                `Частин: ${advertisement.part}\n` +
                `Ставка: ${advertisement.rate}%\n` +
                `Дійсне до: ${advertisement.deadline}\n` +
                `${advertisement.extraInfo}`,
                Markup.inlineKeyboard([[
                    Markup.button.webApp(`Редагувати`, `${process.env.ADVERTISEMENT_REDACT_URL}${advertisement._id}`),
                    Markup.button.callback('Скасувати', 'delete_advertisement')],
                    [Markup.button.callback('Переглянути чати', 'show_advertisement_chats')],
                    [Markup.button.callback(`${button}`, callbackButton)]
                ])
            )
        }

    }else{
        if(advertisement.rate == 0){
            let requestsRate = []
            requestsRate = await requestRateService.getByAdvertisementId(advertisement._id)

            await bot.telegram.sendMessage(chatId, `Оголошення №${advertisement.number }\n` +
                `${advertisement.type}: ${advertisement.total} USDT trc20\n` +
                `Місто: ${city.name}\n` +
                `Частин: ${advertisement.part}\n` +
                `Ставка: ${advertisement.rate}%\n` +
                `Дійсне до: ${advertisement.deadline}\n` +
                `${advertisement.extraInfo}\n` +
                `\n` +
                `У вас зараз [${requestsRate.length}] нових пропозицій`,
                Markup.inlineKeyboard([[
                    Markup.button.webApp(`Редагувати`, `${process.env.ADVERTISEMENT_REDACT_URL}${advertisement._id}`),
                    Markup.button.callback('Скасувати', 'delete_advertisement')
                ],
                    [Markup.button.callback('Переглянути пропозиції', 'show_requests_rate')],
                    [Markup.button.callback('Переглянути чати', 'show_advertisement_chats')]])
            )
        }else{
            await bot.telegram.sendMessage(chatId, `Оголошення №${advertisement.number }\n` +
                `${advertisement.type}: ${advertisement.total} USDT trc20\n` +
                `Місто: ${city.name}\n` +
                `Частин: ${advertisement.part}\n` +
                `Ставка: ${advertisement.rate}%\n` +
                `Дійсне до: ${advertisement.deadline}\n` +
                `${advertisement.extraInfo}`,
                Markup.inlineKeyboard([[
                    Markup.button.webApp(`Редагувати`, `${process.env.ADVERTISEMENT_REDACT_URL}${advertisement._id}`),
                    Markup.button.callback('Скасувати', 'delete_advertisement')],
                    [Markup.button.callback('Переглянути чати', 'show_advertisement_chats')]
                ])
            )
        }
    }



}


        // SERVER \\

const express = require('express')
const cors = require('cors')
const router = require('./server/routers/index')
const errorMiddleware = require('./server/middleware/errorHandlingMiddleware')

const app = new express()
const PORT = 5000 || process.env.PORT

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000','https://heroic-profiterole-cc695c.netlify.app', 'https://main--voluble-pegasus-6a9597.netlify.app','https://neon-kulfi-303418.netlify.app']
}))
app.use('/', router)
app.use(errorMiddleware)


async function start(){
    try{
        app.listen(PORT, () => {
            console.log(`Server started on PORT: ${PORT}`)
        })
    }catch (e){
        console.log(e)
    }
}

start()
bot.launch().catch(err => {console.log("error: ", err)})

