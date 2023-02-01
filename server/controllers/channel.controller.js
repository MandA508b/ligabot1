const channelService  = require('../services/channel.service')
const ApiError = require('../errors/api.error')

class channelController{
    async create(req, res, next){
        try{
            const {channelId, number, leagueId, URL} = req.body
            if(!channelId || !number || !leagueId || !URL){
                return next(ApiError.badRequest('!channelId || !number || !leagueId || !URL'))
            }
            const channel = await channelService.create(channelId, number, leagueId, URL)

            return res.json({channel})
        }catch (e) {
            next(e)
        }
    }

    async delete(req, res, next){
        try{
            const {channelId} = req.body
            if(!channelId){
                return next(ApiError.badRequest('!channelId'))
            }
            const channel = await channelService.delete(channelId)

            return res.json({channel})
        }catch (e) {
            next(e)
        }
    }

    async redact(req, res, next){
        try{
            const {channelId, data} = req.body
            if(!channelId || !data){
                return next(ApiError.badRequest('!channelId || !data'))
            }
            const channel = await channelService.redact(channelId, data)

            return res.json({channel})
        }catch (e) {
            next(e)
        }
    }

    async findAll(req, res, next){
        try{
            const channels = await channelService.findAll()

            return res.json({channels})
        }catch (e) {
            next(e)
        }
    }

    async getByLeagueId(req, res, next){
        try{
            const {leagueId} = req.body
            if(!leagueId){
                return next(ApiError.badRequest('!leagueId'))
            }
            const channel = await channelService.getByLeagueId(leagueId)

            return res.json({channel})
        }catch (e) {
            next(e)
        }
    }

}

module.exports = new channelController()