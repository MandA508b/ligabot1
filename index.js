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


async function menu(ctx){
    await ctx.reply('menu:', Markup
        .keyboard([
            ['Додати оголошення', 'Мої оголошення'],
            ['Канали', 'Мої чати']
        ])
        .oneTime()
        .resize()
    )
}

bot.start(async (ctx) => {
    await menu(ctx)
    const registration = await userController.start(ctx.update.message.from)
    if(registration)
        ctx.reply("Вітаю! Ви успішно зареєстровані як користувач!")
    else
        ctx.reply("Ви вже зареєстровані!")
})


bot.hears('Канали', async (ctx)=>{
    await menu(ctx)
    const userAuth =  await userService.getUserByTelegramId(ctx.update.message.from.id)
    const accessToMenu = await userController.accessToMenu(ctx.update.message.from.id)
    if(userAuth.isBlocked || !accessToMenu){
        return ctx.reply('У вас немає доступу!')
    }

    const user = await userService.getUserByTelegramId(ctx.update.message.from.id)
    const channels = await channelService.getAllByLeagueId(user.leagueId)
    let channelsList = 'Ваші канали:\n'
    for (let channelsKey in channels) {
        channelsList += `${channels[channelsKey].URL}\n`
    }
    ctx.reply(channelsList)
})

bot.hears('Мої оголошення', async (ctx)=> {
    await menu(ctx)
    const userAuth =  await userService.getUserByTelegramId(ctx.update.message.from.id)
    const accessToMenu = await userController.accessToMenu(ctx.update.message.from.id)
    if(userAuth.isBlocked || !accessToMenu){
        return ctx.reply('У вас немає доступу!')
    }

    const advertisements = await advertisementService.getAllByTelegramId(ctx.update.message.from.id)

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
            ]))
    }
})

bot.action('delete', async (ctx) => {
    await menu(ctx)
    const number = Number(ctx.update.callback_query.message.text.split(' ')[1].split('\n')[0].slice(1))
    await advertisementService.deleteByNumber(number)
    await ctx.telegram.deleteMessage(ctx.update.callback_query.message.chat.id, ctx.update.callback_query.message.message_id)
})

bot.hears('Додати оголошення', async (ctx)=> {
    await menu(ctx)
    const userAuth =  await userService.getUserByTelegramId(ctx.update.message.from.id)
    const accessToMenu = await userController.accessToMenu(ctx.update.message.from.id)
    if(userAuth.isBlocked || !accessToMenu){
        return ctx.reply('У вас немає доступу!')
    }

    ctx.reply('Заповніть форму: ',
        Markup.inlineKeyboard([
            Markup.button.webApp('Заповнити', `${process.env.ADVERTISEMENT_CREATE_URL}`)
        ]))

})

bot.action('1', async (ctx)=> {
    const number = Number(ctx.update.callback_query.message.text.split(' ')[1].split('\n')[0].slice(1))
    const advertisement = await advertisementService.getByNumber(number)

    if(!advertisement)return ctx.telegram.sendMessage(ctx.update.callback_query.from.id, "Щось пішло не так!")

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
    ]))

    await ctx.telegram.sendMessage(userCustomer.telegramId, `Хтось хоче вам відповісти на замовлення №${number}`, Markup.inlineKeyboard([
        Markup.button.webApp(`Відповісти`, `${process.env.CHAT_URL}/chat?name=customer&room=${chat.room}`),
    ]))
    await ctx.telegram.sendMessage(userClient.telegramId,'menu:', Markup
        .keyboard([
            ['Додати оголошення', 'Мої оголошення'],
            ['Канали', 'Мої чати']
        ])
        .oneTime()
        .resize()
    )

})

bot.hears('Мої чати', async (ctx)=>{
    await menu(ctx)
    const userAuth =  await userService.getUserByTelegramId(ctx.update.message.from.id)
    const accessToMenu = await userController.accessToMenu(ctx.update.message.from.id)
    if(userAuth.isBlocked || !accessToMenu){
        return ctx.reply('У вас немає доступу!')
    }

    const user = await userService.getUserByTelegramId(ctx.update.message.from.id)
    const customerChats = await chatService.getAllByCustomerId(user._id)
    if(customerChats.length)    await bot.telegram.sendMessage(ctx.update.message.from.id, "Писали вам :")

    for (let chatsKey in customerChats) {
        console.log(chatsKey)
        const advertisement = await advertisementService.getById(customerChats[chatsKey].advertisementId)
        console.log(advertisement)
        await bot.telegram.sendMessage(ctx.update.message.from.id, `Листування з оголошенням №${advertisement.number}`, Markup.inlineKeyboard([
            Markup.button.webApp(`Написати`, `${process.env.CHAT_URL}/chat?name=customer&room=${customerChats[chatsKey].room}`)]))
    }

    const clientChats = await chatService.getAllByClientId(user._id)
    if(clientChats.length)    await bot.telegram.sendMessage(ctx.update.message.from.id, "Писали ви :")

    for (let chatsKey in clientChats) {
        const advertisement = await advertisementService.getById(clientChats[chatsKey].advertisementId)
        await bot.telegram.sendMessage(ctx.update.message.from.id, `Листування з оголошенням №${advertisement.number}`, Markup.inlineKeyboard([
            Markup.button.webApp(`Написати`, `${process.env.CHAT_URL}/chat?name=client&room=${clientChats[chatsKey].room}`)]))
    }
})

startServer()
bot.launch()
