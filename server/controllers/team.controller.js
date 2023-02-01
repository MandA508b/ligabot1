const teamService  = require('../services/team.service')
const ApiError = require(`../errors/api.error`)

class teamController{
    async create(req, res, next){
        try{
            const {name, leagueId} = req.body
            if(!name || !leagueId){
                return next(ApiError.badRequest('!name || !leagueId'))
            }
            const team = await teamService.create(name, leagueId)

            return res.json({team})
        }catch (e) {
            next(e)
        }
    }

    async delete(req, res, next){
        try{
            const {teamId} = req.body
            if(!teamId){
                return next(ApiError.badRequest('!teamId'))
            }
            const team = await teamService.delete( teamId)

            return res.json({team})
        }catch (e) {
            next(e)
        }
    }
    async findByLeagueId(req, res, next){
        try{
            const {leagueId} = req.body
            if(!leagueId){
                return next(ApiError.badRequest('!leagueId'))
            }
            const team = await teamService.findByLeagueId( leagueId)

            return res.json({team})
        }catch (e) {
            next(e)
        }
    }


    async findTeamsByLeagueId(req, res, next){
        try{
            const {leagueId} = req.body
            if(!leagueId){
                return next(ApiError.badRequest('!leagueId'))
            }
            const teams = await teamService.findTeamsByLeagueId(leagueId)

            return res.json({teams})
        }catch (e) {
            next(e)
        }
    }
    async findTeamById(req, res, next){
        try{
            const {id} = req.body
            if(!id){
                return next(ApiError.badRequest('!id'))
            }
            const teams = await teamService.findTeamById(id)

            return res.json({teams})
        }catch (e) {
            next(e)
        }
    }
    async redact(req, res, next){
        try{
            const {teamId, data} = req.body
            if(!teamId || !data){
                return next(ApiError.badRequest('!teamId || !data'))
            }
            const team = await teamService.redact(teamId, data)

            return res.json({team})
        }catch (e) {
            next(e)
        }
    }

    async findAll(req, res, next){
        try{
            const teams = await teamService.findAll()

            return res.json({teams})
        }catch (e) {
            next(e)
        }
    }

}

module.exports = new teamController()