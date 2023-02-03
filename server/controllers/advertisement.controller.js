const advertisementService  = require('../services/advertisement.service')
const cityService  = require('../services/city.service')
const ApiError = require('../errors/api.error')
const bot = require('../../telgram/telegram')
const {Markup} = require("telegraf");
const channelService =require('../services/channel.service')

class advertisementController{
    async create(req, res, next){
        try{
            const {userId,leagueId,type,cityId,total,part,rate,deadline,extraInfo} = req.body
            if(!userId || !leagueId || !type ||! cityId || !total || !rate || !deadline){
               // console.log(userId,leagueId,type,cityId,total,part,rate,deadline,extraInfo)
                return next(ApiError.badRequest('!name || !userId || !type ||! cityId || !total || !rate || !deadline'))
            }
            const advertisement = await advertisementService.create(userId,leagueId,type,cityId,total,part,rate,deadline,extraInfo)

            const channel = await channelService.getByLeagueId(leagueId)

            if(channel){
                const cityName = await cityService.findById(advertisement.cityId)

                const channelId = channel.channelId.toString()
                await bot.telegram.sendMessage(channelId, `Оголошення №${advertisement.number}\n`+
                    `${advertisement.type}: ${advertisement.total} USDT trc20\n`+
                    `Місто: ${cityName.name}\n`+
                    `Частин: ${advertisement.rate}\n`+
                    `Ставка: ${advertisement.part}%\n`+
                    `Дійсне до: ${advertisement.deadline}\n`+
                    `${advertisement.extraInfo}`,
                    Markup.inlineKeyboard([
                        Markup.button.url('Написати', `${process.env.CHAT_URL}`)
                    ])
                );
            }

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