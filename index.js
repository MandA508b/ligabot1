require('dotenv').config()
const { Markup } = require('telegraf')
const startServer = require('./server/index')
const userController = require('./controllers/user.controller')
const advertisementService = require('./server/services/advertisement.service')
const cityService = require("./server/services/city.service");
const channelService = require('./server/services/channel.service')
const userService = require('./server/services/user.service')
const chatService = require('./server/services/chat.service')
const bot = require('./telgram/telegram')
const chatDataService = require("./server/services/chatData.service");

bot.telegram.setMyCommands( [{ command: 'menu', description: 'Open menu buttons' }, { command: 'start', description: 'Start the bot' }])

bot.start(async (ctx) => {
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
})


bot.hears('Канали', async (ctx)=>{
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
    const channels = await channelService.getAllByLeagueId(user.leagueId)
    let channelsList = 'Ваші канали:\n'
    for (let channelsKey in channels) {
        channelsList += `${channels[channelsKey].URL}\n`
    }
    await ctx.reply(channelsList, Markup
        .keyboard([
            ['Додати оголошення', 'Мої оголошення'],
            ['Канали', 'Мої чати']
        ])
        .oneTime()
        .resize()
    )
})

bot.hears('Мої оголошення', async (ctx)=> {
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
            ['Додати оголошення', 'Мої оголошення'],
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
            `Частин: ${advertisements[advertisementsKey].rate}\n` +
            `Ставка: ${advertisements[advertisementsKey].part}%\n` +
            `Дійсне до: ${advertisements[advertisementsKey].deadline}\n` +
            `${advertisements[advertisementsKey].extraInfo}`,
            Markup.inlineKeyboard([
                Markup.button.webApp(`Редагувати`, `${process.env.ADVERTISEMENT_REDACT_URL}${advertisements[advertisementsKey]._id}`),
                Markup.button.callback('Скасувати', 'delete')
            ]), Markup
                .keyboard([
                    ['Додати оголошення', 'Мої оголошення'],
                    ['Канали', 'Мої чати']
                ])
                .oneTime()
                .resize()
        )
    }
})

bot.action('delete', async (ctx) => {
    const number = Number(ctx.update.callback_query.message.text.split(' ')[1].split('\n')[0].slice(1))
    await advertisementService.deleteByNumber(number)
    await ctx.telegram.deleteMessage(ctx.update.callback_query.message.chat.id, ctx.update.callback_query.message.message_id)
})

bot.hears('Додати оголошення', async (ctx)=> {
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
            ['Додати оголошення', 'Мої оголошення'],
            ['Канали', 'Мої чати']
        ])
        .oneTime()
        .resize()
    )
    await ctx.reply('ФОРМА',
        Markup.inlineKeyboard([
            Markup.button.webApp('Заповнити', `${process.env.ADVERTISEMENT_CREATE_URL}`)
        ]), Markup
            .keyboard([
                ['Додати оголошення', 'Мої оголошення'],
                ['Канали', 'Мої чати']
            ])
            .oneTime()
            .resize()
    )

})

bot.action('1', async (ctx)=> {
    const number = Number(ctx.update.callback_query.message.text.split(' ')[1].split('\n')[0].slice(1))
    const advertisement = await advertisementService.getByNumber(number)

    if(!advertisement)return await ctx.telegram.sendMessage(ctx.update.callback_query.from.id, "Щось пішло не так!", Markup
        .keyboard([
            ['Додати оголошення', 'Мої оголошення'],
            ['Канали', 'Мої чати']
        ])
        .oneTime()
        .resize()
    )

    const userClient = await userService.getUserByTelegramId(ctx.update.callback_query.from.id)
    const userCustomer = await userService.getUserById(advertisement.userId)

    const chat = await chatService.create(advertisement._id, advertisement.userId, userClient._id)

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
    ]), Markup
        .keyboard([
            ['Додати оголошення', 'Мої оголошення'],
            ['Канали', 'Мої чати']
        ])
        .oneTime()
        .resize()
    )

    await ctx.telegram.sendMessage(userCustomer.telegramId, `Хтось хоче вам відповісти на замовлення №${number}`, Markup.inlineKeyboard([
        Markup.button.webApp(`Відповісти`, `${process.env.CHAT_URL}/chat?name=customer&room=${chat.room}`)
    ]), Markup
        .keyboard([
            ['Додати оголошення', 'Мої оголошення'],
            ['Канали', 'Мої чати']
        ])
        .oneTime()
        .resize()
    )

})

bot.hears('Мої чати', async (ctx)=>{
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
            ['Додати оголошення', 'Мої оголошення'],
            ['Канали', 'Мої чати']
        ])
        .oneTime()
        .resize()
    )

    for (let chatsKey in customerChats) {
        const advertisement = await advertisementService.getById(customerChats[chatsKey].advertisementId)
        await bot.telegram.sendMessage(ctx.update.message.from.id, `Листування з оголошенням №${advertisement.number}`, Markup.inlineKeyboard([
            Markup.button.webApp(`Написати`, `${process.env.CHAT_URL}/chat?name=customer&room=${customerChats[chatsKey].room}`)]), Markup
            .keyboard([
                ['Додати оголошення', 'Мої оголошення'],
                ['Канали', 'Мої чати']
            ])
            .oneTime()
            .resize()
        )
    }

    const clientChats = await chatService.getAllByClientId(user._id)
    if(clientChats.length)    await bot.telegram.sendMessage(ctx.update.message.from.id, "Писали ви :", Markup
        .keyboard([
            ['Додати оголошення', 'Мої оголошення'],
            ['Канали', 'Мої чати']
        ])
        .oneTime()
        .resize()
    )

    for (let chatsKey in clientChats) {
        const advertisement = await advertisementService.getById(clientChats[chatsKey].advertisementId)
        await bot.telegram.sendMessage(ctx.update.message.from.id, `Листування з оголошенням №${advertisement.number}`, Markup.inlineKeyboard([
            Markup.button.webApp(`Написати`, `${process.env.CHAT_URL}/chat?name=client&room=${clientChats[chatsKey].room}`)]), Markup
            .keyboard([
                ['Додати оголошення', 'Мої оголошення'],
                ['Канали', 'Мої чати']
            ])
            .oneTime()
            .resize()
        )
    }
})

bot.hears('/menu', async (ctx)=>{
    await ctx.reply('menu:', Markup
        .keyboard([
            ['Додати оголошення', 'Мої оголошення'],
            ['Канали', 'Мої чати']
        ])
        .oneTime()
        .resize()
    )
})


startServer()
bot.launch()
