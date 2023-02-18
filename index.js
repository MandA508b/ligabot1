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
        if(registration)
            await ctx.reply("Вітаю! Ви успішно зареєстровані як користувач!", Markup
                .keyboard([
                    ['Додати оголошення', 'Мої оголошення'],
                    ['Канали', 'Мої чати']
                ])
                .oneTime()
                .resize()
            )
        else
            await ctx.reply("Ви вже зареєстровані!", Markup
                .keyboard([
                    ['Додати оголошення', 'Мої оголошення'],
                    ['Канали', 'Мої чати']
                ])
                .oneTime()
                .resize()
            )
    }catch (e) {
        console.log('error: ', e)
    }
})


bot.hears('Канали', async (ctx)=>{
   try{
       await ctx.telegram.deleteMessage(ctx.update.message.from.id, ctx.update.message.message_id)

       const userAuth =  await userService.getUserByTelegramId(ctx.update.message.from.id)
       const accessToMenu = await userController.accessToMenu(ctx.update.message.from.id)
       if(userAuth.isBlocked || !accessToMenu){
           return await ctx.reply('У вас немає доступу!', Markup
               .keyboard([
                   ['Додати оголошення', 'Мої оголошення'],
                   ['Канали', 'Мої чати']
               ])
               .oneTime()
               .resize()
           )
       }

       const user = await userService.getUserByTelegramId(ctx.update.message.from.id)

       const team = await teamService.findByTeamId(user.teamId)

       const channel = await channelService.getByLeagueId(team.leagueId)

       let channelsList = 'Ваші канали:\n' + `${channel.URL}`

       await ctx.reply(channelsList, Markup
           .keyboard([
               ['Додати оголошення', 'Мої оголошення'],
               ['Канали', 'Мої чати']
           ])
           .oneTime()
           .resize()
       )
   }catch (e) {
       console.log('error: ', e)
   }
})

bot.hears('Мої оголошення', async (ctx)=> {
    try{
        await ctx.telegram.deleteMessage(ctx.update.message.from.id, ctx.update.message.message_id)

        const userAuth =  await userService.getUserByTelegramId(ctx.update.message.from.id)
        const accessToMenu = await userController.accessToMenu(ctx.update.message.from.id)
        if(userAuth.isBlocked || !accessToMenu){
            return await ctx.reply('У вас немає доступу!', Markup
                .keyboard([
                    ['Додати оголошення', 'Мої оголошення'],
                    ['Канали', 'Мої чати']
                ])
                .oneTime()
                .resize()
            )
        }

        const advertisements = await advertisementService.getAllByTelegramId(ctx.update.message.from.id)
        await ctx.reply("Ваші оголошення: ", Markup
            .keyboard([
                ['Додати оголошення', 'Мої оголошення', 'Мої пропозиції'],
                ['Канали', 'Мої чати']
            ])
            .oneTime()
            .resize()
        )
        for (let advertisementsKey in advertisements) {
            const cityId = advertisements[advertisementsKey].cityId
            const cityName = await cityService.findById(cityId)

            await bot.telegram.sendMessage(ctx.update.message.from.id, `Оголошення №${advertisements[advertisementsKey].number }\n` +
                `${advertisements[advertisementsKey].type}: ${advertisements[advertisementsKey].total} USDT trc20\n` +
                `Місто: ${cityName.name}\n` +
                `Частин: ${advertisements[advertisementsKey].part}\n` +
                `Ставка: ${advertisements[advertisementsKey].rate}%\n` +
                `Дійсне до: ${advertisements[advertisementsKey].deadline}\n` +
                `${advertisements[advertisementsKey].extraInfo}`,
                Markup.inlineKeyboard([
                    Markup.button.webApp(`Редагувати`, `${process.env.ADVERTISEMENT_REDACT_URL}${advertisements[advertisementsKey]._id}`),
                    Markup.button.callback('Скасувати', 'delete')
                ])
            )
        }
    }catch (e) {
        console.log('error: ', e)
    }
})

bot.action('delete', async (ctx) => {
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
        await ctx.telegram.deleteMessage(ctx.update.message.from.id, ctx.update.message.message_id)

        const userAuth =  await userService.getUserByTelegramId(ctx.update.message.from.id)
        const accessToMenu = await userController.accessToMenu(ctx.update.message.from.id)
        if(userAuth.isBlocked || !accessToMenu){
            return await ctx.reply('У вас немає доступу!', Markup
                .keyboard([
                    ['Додати оголошення', 'Мої оголошення'],
                    ['Канали', 'Мої чати']
                ])
                .oneTime()
                .resize()
            )
        }
        await ctx.reply("Заповніть форму:", Markup
            .keyboard([
                ['Додати оголошення', 'Мої оголошення', 'Мої пропозиції'],
                ['Канали', 'Мої чати']
            ])
            .oneTime()
            .resize()
        )
        await ctx.reply('ФОРМА',
            Markup.inlineKeyboard([
                Markup.button.webApp('Заповнити', `${process.env.ADVERTISEMENT_CREATE_URL}`)
            ])
        )

    }catch (e) {
        console.log('error: ', e)
    }
})

bot.action('send_message', async (ctx)=> {
    try{
        const number = Number(ctx.update.callback_query.message.text.split(' ')[1].split('\n')[0].slice(1))
        const advertisement = await advertisementService.getByNumber(number)

        if(!advertisement)return await ctx.telegram.sendMessage(ctx.update.callback_query.from.id, "Щось пішло не так!", Markup
            .keyboard([
                ['Додати оголошення', 'Мої оголошення', 'Мої пропозиції'],
                ['Канали', 'Мої чати']
            ])
            .oneTime()
            .resize()
        )

        const userClient = await userService.getUserByTelegramId(ctx.update.callback_query.from.id)
        const userCustomer = await userService.getUserById(advertisement.userId)

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
                Markup.button.webApp(`Відповісти`, `${process.env.CHAT_URL}/chat?name=client&room=${chat.room}`),
            ])
        )

        await ctx.telegram.sendMessage(userCustomer.telegramId, `Хтось хоче вам відповісти на замовлення №${number}`, Markup.inlineKeyboard([
                Markup.button.webApp(`Відповісти`, `${process.env.CHAT_URL}/chat?name=customer&room=${chat.room}`)
            ])
        )
    }catch (e){
        console.log('error: ', e)
    }

})

bot.action('send_rate_request', async (ctx)=> {
    try{
        const number = Number(ctx.update.callback_query.message.text.split(' ')[1].split('\n')[0].slice(1))
        const advertisement = await advertisementService.getByNumber(number)

        if(!advertisement)return await ctx.telegram.sendMessage(ctx.update.callback_query.from.id, "Щось пішло не так!", Markup
            .keyboard([
                ['Додати оголошення', 'Мої оголошення', 'Мої пропозиції'],
                ['Канали', 'Мої чати']
            ])
            .oneTime()
            .resize()
        )

        const userClient = await userService.getUserByTelegramId(ctx.update.callback_query.from.id)
        const userCustomer = await userService.getUserById(advertisement.userId)

        const chat = await chatService.create(advertisement._id, advertisement.userId, userClient._id, false)

        await ctx.telegram.sendMessage(userCustomer.telegramId,`Запропунувати ціну на замовлення №${number}`, Markup.inlineKeyboard([
                Markup.button.webApp(`Відповісти`, `${process.env.ADVERTISEMENT_CREATE_URL}/rate/?chatId=${chat._id}&advertisement=${advertisement._id}`),// requestRAte, advertId
            ])
        )
    }catch (e){
        console.log('error: ', e)
    }

})

bot.action('accept_rate', async (ctx)=> {
    try{
        let requestRateNumber = Number(ctx.update.callback_query.message.text.split(' ')[1])
        requestRateNumber = requestRateNumber.slice(1, requestRateNumber.length-2)

        const advertisementNumber = Number(ctx.update.callback_query.message.text.split('\n')[1].split(' ')[10].slice(1))
        console.log(advertisementNumber)
        const advertisement = await advertisementService.getByNumber(advertisementNumber)

        console.log(requestRateNumber, advertisement._id)

        if(!advertisement || !requestRateNumber)return await ctx.telegram.sendMessage(ctx.update.callback_query.from.id, "Щось пішло не так!", Markup
            .keyboard([
                ['Додати оголошення', 'Мої оголошення', 'Мої пропозиції'],
                ['Канали', 'Мої чати']
            ])
            .oneTime()
            .resize()
        )

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
        //data to delete requestRate and chat
        let requestRateNumber = Number(ctx.update.callback_query.message.text.split(' ')[1])
        requestRateNumber = requestRateNumber.slice(1, requestRateNumber.length-2)

        const advertisementNumber = Number(ctx.update.callback_query.message.text.split('\n')[1].split(' ')[10].slice(1))
        console.log(advertisementNumber)
        const advertisement = await advertisementService.getByNumber(advertisementNumber)

        console.log(requestRateNumber, advertisement._id)

        if(!advertisement || !requestRateNumber)return await ctx.telegram.sendMessage(ctx.update.callback_query.from.id, "Щось пішло не так!", Markup
            .keyboard([
                ['Додати оголошення', 'Мої оголошення', 'Мої пропозиції'],
                ['Канали', 'Мої чати']
            ])
            .oneTime()
            .resize()
        )

        const requestRate = await requestRateService.findByNumber(requestRateNumber, advertisement._id)
        let chat = await chatService.findById(requestRate.chatId)

        //data to send notification of canceling
        const userClient = chat.clientId
        const userCustomer = chat.customerId

        //delete chat
        chat = await chatService.delete(requestRate.chatId)

        //delete requestRate
        await requestRateService.deleteByNumber(requestRateNumber, advertisement._id)

        //send notification to users
        await ctx.telegram.sendMessage(userClient,`Вашу ставку на замовлення №${advertisementNumber} скасували`
        )

        await ctx.telegram.sendMessage(userCustomer, `Ви успішно скасували ставку на замовлення №${advertisementNumber}`
        )

    }catch (e){
        console.log('error: ', e)
    }

})

bot.hears('Мої чати', async (ctx)=>{
    try{
        await ctx.telegram.deleteMessage(ctx.update.message.from.id, ctx.update.message.message_id)

        const userAuth =  await userService.getUserByTelegramId(ctx.update.message.from.id)
        const accessToMenu = await userController.accessToMenu(ctx.update.message.from.id)
        if(userAuth.isBlocked || !accessToMenu){
            return await ctx.reply('У вас немає доступу!', Markup
                .keyboard([
                    ['Додати оголошення', 'Мої оголошення'],
                    ['Канали', 'Мої чати']
                ])
                .oneTime()
                .resize()
            )
        }

        const user = await userService.getUserByTelegramId(ctx.update.message.from.id)
        const customerChats = await chatService.getAllByCustomerId(user._id)
        if(customerChats.length)    await bot.telegram.sendMessage(ctx.update.message.from.id, "Писали вам :", Markup
            .keyboard([
                ['Додати оголошення', 'Мої оголошення', 'Мої пропозиції'],
                ['Канали', 'Мої чати']
            ])
            .oneTime()
            .resize()
        )

        for (let chatsKey in customerChats) {
            const advertisement = await advertisementService.getById(customerChats[chatsKey].advertisementId)
            await bot.telegram.sendMessage(ctx.update.message.from.id, `Листування з оголошенням №${advertisement.number}`, Markup.inlineKeyboard([
                Markup.button.webApp(`Написати`, `${process.env.CHAT_URL}/chat?name=customer&room=${customerChats[chatsKey].room}`)])
            )
        }

        const clientChats = await chatService.getAllByClientId(user._id)
        if(clientChats.length)    await bot.telegram.sendMessage(ctx.update.message.from.id, "Писали ви :", Markup
            .keyboard([
                ['Додати оголошення', 'Мої оголошення', 'Мої пропозиції'],
                ['Канали', 'Мої чати']
            ])
            .oneTime()
            .resize()
        )

        for (let chatsKey in clientChats) {
            const advertisement = await advertisementService.getById(clientChats[chatsKey].advertisementId)
            await bot.telegram.sendMessage(ctx.update.message.from.id, `Листування з оголошенням №${advertisement.number}`, Markup.inlineKeyboard([
                Markup.button.webApp(`Написати`, `${process.env.CHAT_URL}/chat?name=client&room=${clientChats[chatsKey].room}`)])
            )
        }
    }catch (e){
        console.log('error: ', e)
    }
})

bot.hears('Мої пропозиції', async (ctx)=>{
    try{
        await ctx.telegram.deleteMessage(ctx.update.message.from.id, ctx.update.message.message_id)

        const userAuth =  await userService.getUserByTelegramId(ctx.update.message.from.id)
        const accessToMenu = await userController.accessToMenu(ctx.update.message.from.id)
        if(userAuth.isBlocked || !accessToMenu){
            return await ctx.reply('У вас немає доступу!', Markup
                .keyboard([
                    ['Додати оголошення', 'Мої оголошення'],
                    ['Канали', 'Мої чати']
                ])
                .oneTime()
                .resize()
            )
        }
        const user = await userService.getUserByTelegramId(ctx.update.message.from.id)

        const requestChats = await chatService.findAllRequestsByUserId(user._id)
        console.log(requestChats)

        await bot.telegram.sendMessage(ctx.update.message.from.id, "Ваші запити :", Markup
            .keyboard([
                ['Додати оголошення', 'Мої оголошення', 'Мої пропозиції'],
                ['Канали', 'Мої чати']
            ])
            .oneTime()
            .resize()
        )

        for (let chatsKey in requestChats) {
            const advertisement = await advertisementService.getById(requestChats[chatsKey].advertisementId)
            await bot.telegram.sendMessage(ctx.update.message.from.id, `Запит на оголошенням №${advertisement.number}`)
        }
    }catch (e){
        console.log('error: ', e)
    }
})

bot.hears('/menu', async (ctx)=>{
    try{
        await ctx.telegram.deleteMessage(ctx.update.message.from.id, ctx.update.message.message_id)

        await ctx.reply('menu:', Markup
            .keyboard([
                ['Додати оголошення', 'Мої оголошення', 'Мої пропозиції'],
                ['Канали', 'Мої чати']
            ])
            .oneTime()
            .resize()
        )
    }catch (e) {
        console.log('error: ', e)
    }
})

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

