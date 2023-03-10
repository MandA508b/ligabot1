const advertisementService  = require('../services/advertisement.service')
const cityService  = require('../services/city.service')
const ApiError = require('../errors/api.error')
const bot = require('../../telgram/telegram')
const {Markup} = require("telegraf");
const channelService =require('../services/channel.service')
const userService = require('../services/user.service')

class advertisementController{
    async create(req, res, next){
        try{
            const {userId,leagueId,type,cityId,total,part,rate,deadline,extraInfo} = req.body
            if(!userId || !leagueId || !type || !cityId || total == undefined || rate == undefined || !deadline){
                return next(ApiError.badRequest('!userId || !type ||! cityId || !total || !rate || !deadline'))
            }

            const advertisement = await advertisementService.create(userId,leagueId,type,cityId,total,part,rate,deadline,extraInfo)
            const channel = await channelService.getByLeagueId(leagueId)

            if(channel){
                const cityName = await cityService.findById(advertisement.cityId)
                if(advertisement.rate === 0){
                    await bot.telegram.sendMessage(channel.channelId, `Оголошення №${advertisement.number}\n`+
                        `${advertisement.type}: ${advertisement.total} USDT trc20\n`+
                        `Місто: ${cityName.name}\n`+
                        `Частин: ${advertisement.part}\n`+
                        `Ставка: ${advertisement.rate}%\n`+
                        `Дійсне до: ${advertisement.deadline}\n`+
                        `${advertisement.extraInfo}`,
                        Markup.inlineKeyboard([
                            Markup.button.callback('Запропонувати ціну', `send_rate_request`)
                        ])
                    ).then((m) => {
                        advertisementService.addChannelMessageId(m.message_id, advertisement._id)
                    });
               }else{
                   await bot.telegram.sendMessage(channel.channelId, `Оголошення №${advertisement.number}\n`+
                       `${advertisement.type}: ${advertisement.total} USDT trc20\n`+
                       `Місто: ${cityName.name}\n`+
                       `Частин: ${advertisement.part}\n`+
                       `Ставка: ${advertisement.rate}%\n`+
                       `Дійсне до: ${advertisement.deadline}\n`+
                       `${advertisement.extraInfo}`,
                       Markup.inlineKeyboard([
                           Markup.button.callback('Написати', `create_chat`)
                       ])
                   ).then((m) => {
                       advertisementService.addChannelMessageId(m.message_id, advertisement._id)
                   });
               }
            }

            const user = await userService.getUserById(userId)

            await bot.telegram.sendMessage(user.telegramId, `Ваше оголошення №${advertisement.number} було успішно додано!`, Markup
                .keyboard([
                    ['Додати оголошення', 'Мої оголошення', 'Мої пропозиції'],
                    ['Канали', 'Мої чати']
                ])
                .oneTime()
                .resize()
            ).then((m) => {
                advertisementService.addChannelMessageId(m.message_id, advertisement._id)
            });

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