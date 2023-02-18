const chatService  = require('../services/chat.service')
const ApiError = require('../errors/api.error')

class chatController{
    async create(req, res, next){
        try{
            const {advertisementId, customerId, clientId, accepted} = req.body
            if(!advertisementId || !customerId || !clientId){
                return next(ApiError.badRequest('!advertisementId || !customerId || !clientId'))
            }
            const chat = await chatService.create(advertisementId, customerId, clientId, accepted)

            return res.json({chat})
        }catch (e) {
            next(e)
        }
    }

    async delete(req, res, next){
        try{
            const {chatId} = req.body
            if(!chatId){
                return next(ApiError.badRequest('!chatId'))
            }
            const chat = await chatService.delete(chatId)

            return res.json({chat})
        }catch (e) {
            next(e)
        }
    }

    async findAll(req, res, next){
        try{
            const chats = await chatService.findAll()

            return res.json({chats})
        }catch (e) {
            next(e)
        }
    }

    async sendRateRequest(req, res, next){
        try{
            const {chatId, advertisementId, rate} = req.body
            if(!chatId || !advertisementId || !rate){
                return next(ApiError.badRequest('!chatId || !advertisementId || !rate'))
            }
            const request = await chatService.sendRateRequest(chatId, advertisementId, rate)

            return res.json(request)
        }catch (e) {
            next(e)
        }
    }



}

module.exports = new chatController()