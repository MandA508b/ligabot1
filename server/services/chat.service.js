const Chat = require('../../models/chat.model')
const ApiError = require('../errors/api.error')
const bot = require('../../telgram/telegram')
const teamService = require('./team.service')
const advertisementService = require('./advertisement.service')
const {Markup} = require("telegraf");
const requestRateService = require('./requestRate.service')

class chatService{

        async create(advertisementId, customerId, clientId, accepted){
        try{
            const candidate = await Chat.findOne({advertisementId, customerId, clientId})
            if(candidate){
                return candidate
            }
            const room = "" + advertisementId + customerId + clientId

            const chat = await Chat.create({advertisementId, customerId, clientId, room, accepted})

            return chat
        }catch (e) {
            console.log("error: ",e)
        }
    }

    async delete(chatId){
        try{
            const chat = await Chat.findByIdAndDelete(chatId)

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
            const requestRate = await requestRateService.create(chatId, advertisementId)

            if(!chat){
                throw ApiError.notFound('!chat')
            }

            const userClient = chat.clientId
            const userCustomer = chat.customerId

            const teamClient = await teamService.findByTeamId(userClient.teamId)
            const advertisement = await advertisementService.getById(advertisementId)

            if(!teamClient || !advertisement){
                throw ApiError.notFound('!teamClient || !advertisement')
            }

            await bot.telegram.sendMessage(userCustomer, `Запит №${requestRate.number} : \n`+
            `Користувач з команди ${teamClient.name} пропунує ставку ${rate} на вашу заявку №${advertisement.number}`,
                Markup.inlineKeyboard([
                    Markup.button.callback(`Прийняти`, `accept_rate`),
                    Markup.button.callback(`Відмовити`, `cancel_rate`)
            ]))

            await bot.telegram.sendMessage(userClient, `Запит успішно надіслоний, чекайте на зворотню відповідь!\n`)

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


}

module.exports = new chatService()