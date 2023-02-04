const leagueService  = require('../services/league.service')
const ApiError = require(`../errors/api.error`)

class leagueController{
    async create(req, res, next){//TODO: add сhannelId
        try{
            const {name, level} = req.body
            if(!name || !level){
                return next(ApiError.badRequest('!name || !level'))
            }
            const league = await leagueService.create(name, level)

            return res.json({league})
        }catch (e) {
            next(e)
        }
    }

    async getLeagueById(req, res, next){//TODO: add сhannelId
        try{
            const {leagueId} = req.body
            if(!leagueId ){
                return next(ApiError.badRequest('!leagueId'))
            }
            const league = await leagueService.getLeagueById(leagueId)

            return res.json({league})
        }catch (e) {
            next(e)
        }
    }

    async delete(req, res, next){
        try{
            const {leagueId} = req.body
            if(!leagueId){
                return next(ApiError.badRequest('!leagueId'))
            }
            const league = await leagueService.delete( leagueId)

            return res.json({league})
        }catch (e) {
            next(e)
        }
    }

    async redact(req, res, next){
        try{
            const {leagueId, data} = req.body
            if(!leagueId || !data){
                return next(ApiError.badRequest('!leagueId || !data'))
            }
            const league = await leagueService.redact(leagueId, data)

            return res.json({league})
        }catch (e) {
            next(e)
        }
    }

    async findAll(req, res, next){
        try{
            const leagues = await leagueService.findAll()

            return res.json({leagues})
        }catch (e) {
            next(e)
        }
    }

    async findAllStatusTrue(req, res, next){
        try{
            const leagues = await leagueService.findAllStatusTrue()

            return res.json({leagues})
        }catch (e) {
            next(e)
        }
    }
}

module.exports = new leagueController()