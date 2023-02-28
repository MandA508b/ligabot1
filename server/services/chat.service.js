const Chat = require('../../models/chat.model')
const User = require('../../models/user.model')
const ApiError = require('../errors/api.error')
const bot = require('../../telgram/telegram')
const teamService = require('./team.service')
const Advertisement = require('../../models/advertisement.model')
const {Markup} = require("telegraf");
const requestRateService = require('./requestRate.service')
const chatDataService = require('./chatData.service')
const reportService = require('./report.service')

class chatService{

    async create(advertisementId, customerId, clientId, accepted){
        try{
            const candidate = await Chat.findOne({advertisementId, customerId, clientId})
            if(candidate){
                return candidate
            }
            const room = "" + advertisementId + customerId + clientId
            let number = 1
            const chats = await this.getAllByCustomerIdAndAdvertisementId(customerId, advertisementId)
            if( chats.length){
                number = Number(chats[chats.length - 1].number) + Number(1)
            }
            const chat = await Chat.create({advertisementId, customerId, clientId, room, accepted, number})

            return chat
        }catch (e) {
            console.log("error: ",e)
        }
    }

    async delete(chatId){
        try{
            const chat = await Chat.findByIdAndDelete(chatId)
            await chatDataService.deleteByChatName(chat.room)
            await reportService.delete(chatId)

            return chat
        }catch (e) {
            console.log("error: ",e )
        }
    }

    async findAll(){
        try{
            const chats = await Chat.find()

            return chats
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async getByUserId(userId){
        try{
            const chat = await Chat.findOne({userId})

            return chat
        }catch (e) {
            console.log("error: ",e)
        }
    }

    async getAllByCustomerId(userId){
        try{
            const chats = await Chat.find({ customerId: userId, accepted: true})

            return chats
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async getAllByClientId(userId){
        try{
            const chats = await Chat.find({ clientId: userId, accepted: true})

            return chats
        }catch (e){
            console.log("error: ", e)
        }
    }

    async findById(chatId){
        const chat = await Chat.findById(chatId)

        return chat
    }

    async sendRateRequest(chatId, advertisementId, rate){// requestRate: chatId, number

        try{
            const chat = await this.findById(chatId)
            const requestRate = await requestRateService.create(chatId, advertisementId, rate)

            if(!chat){
                throw ApiError.notFound('!chat')
            }

            const userClient = await User.findById(chat.clientId)
            const userCustomer = await User.findById(chat.customerId)

            console.log('sendRate: ',{customer: userCustomer._id, client: userClient._id})

            const teamClient = await teamService.findByTeamId(userClient.teamId)
            const advertisement = await Advertisement.findById(advertisementId)

            if(!teamClient || !advertisement){
                throw ApiError.notFound('!teamClient || !advertisement')
            }

            await bot.telegram.sendMessage(userCustomer.telegramId, `Запит №${requestRate.number} : \n`+
            `Користувач з команди ${teamClient.name} пропунує ставку ${rate} на вашу заявку №${advertisement.number}`,
                Markup.inlineKeyboard([
                    Markup.button.callback(`Прийняти`, `accept_rate`),
                    Markup.button.callback(`Відмовити`, `cancel_rate`)
            ]))

            await bot.telegram.sendMessage(userClient.telegramId, `Запит успішно надіслоний, чекайте на зворотню відповідь!\n`)

        }catch (e) {
            console.log('error: ', e)
        }

    }

    async acceptedToTrue(chatId){
        const chat = await Chat.findOneAndUpdate(chatId, {accepted: true})

        return chat
    }

    async findAllRequestsByUserId(userId){
        try{
            const chats = await Chat.find({ clientId: userId, accepted: false })

            return chats
        }catch (e){
            console.log("error: ", e)
        }
    }

    async getAllByCustomerIdAndAdvertisementId(customerId, advertisementId){
        try{
            const chats = await Chat.find({ customerId: customerId, advertisementId: advertisementId, accepted: true})

            return chats
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async getByClientIdAndAdvertisementId(clientId, advertisementId){
        try{
            const chats = await Chat.findOne({ clientId: clientId, advertisementId: advertisementId, accepted: true})

            return chats
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async getByNumberAndAdvertisementId(number, advertisementId){
        const chat = await Chat.findOne({number, advertisementId})
        return chat
    }

    async getByAdvertisementId(advertisementId){
        const chats = await Chat.find({advertisementId})

        return chats
    }

}

module.exports = new chatService()