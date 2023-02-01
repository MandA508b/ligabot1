const advertisementService  = require('../services/advertisement.service')
const cityService  = require('../services/city.service')
const ApiError = require('../errors/api.error')
const Channel = require('../../models/chennal.model')
const bot = require('../../telgram/telegram')

class advertisementController{
    async create(req, res, next){
        try{
            const {userId,leagueId,type,cityId,total,part,rate,deadline,extraInfo} = req.body
            if(!userId || !leagueId || !type ||! cityId || !total || !rate || !deadline){
                console.log(userId,leagueId,type,cityId,total,part,rate,deadline,extraInfo)
                return next(ApiError.badRequest('!name || !userId || !type ||! cityId || !total || !rate || !deadline'))
            }
            const advertisement = await advertisementService.create(userId,leagueId,type,cityId,total,part,rate,deadline,extraInfo)

            const cityName = await cityService.findById(advertisement.cityId)
            const channel = await Channel.findOne({leagueId})

            bot.telegram.sendMessage(channel.channelId, `Оголошення №${advertisement.number}\n`+
                `${advertisement.type}: ${cityName.name} USDT trc20\n`+
                `Сума: ${advertisement.total}\n`+
                `Частин: ${advertisement.rate}\n`+
                `Ставка: ${advertisement.part}%\n`+
                `Дійсне до: ${advertisement.deadline}\n`+
                `${advertisement.extraInfo}`);

            return res.json({advertisement})
        }catch (e) {
            next(e)
        }
    }

    async delete(req, res, next){
        try{
            const {advertisementId} = req.body
            if(!advertisementId){
                return next(ApiError.badRequest('!advertisementId'))
            }
            const advertisement = await advertisementService.delete(advertisementId)

            return res.json({advertisement})
        }catch (e) {
            next(e)
        }
    }

    async redact(req, res, next){
        try{
            const {advertisementId, data} = req.body
            if(!advertisementId || !data){
                return next(ApiError.badRequest('!advertisementId || !data'))
            }
            const advertisement = await advertisementService.redact(advertisementId, data)

            return res.json({advertisement})
        }catch (e) {
            next(e)
        }
    }

    async findAll(req, res, next){
        try{
            const cities = await advertisementService.findAll()

            return res.json({cities})
        }catch (e) {
            next(e)
        }
    }

    async findById(req, res, next){
        try{
            const {advertisementId} = req.body

            const advertisement = await advertisementService.getById(advertisementId)

            return res.json({advertisement})
        }catch (e) {
            next(e)
        }
    }

}

module.exports = new advertisementController()