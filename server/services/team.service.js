const Team = require('../../models/team.model')
const User = require("../../models/user.model");
const League = require('../../models/league.model')

const ApiError = require('../errors/api.error')

class teamController{

    async findByTeamId(teamId){
        try{
            const team = await Team.findById(teamId)
            return team
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findByLeagueId(leagueId){
        try{
            const teams = await Team.find({leagueId})
            return teams
        }catch (e) {
            console.log("error: ", e)
        }
    }
    async findTeamsByLeagueId(leagueId){
        try{
            const teams = await Team.find({leagueId})
            return teams
        }catch (e) {
            console.log("error: ", e )
        }
    }
    async findTeamById(id){
        try{
            const team = await Team.findById(id)
            return team
        }catch (e) {
            console.log("error: ", e)
        }
    }
    async create(name, leagueId){
        try{
            const team = await Team.create({name, leagueId})

            return team
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async delete(teamId){
        try{
            const team = await Team.findByIdAndDelete(teamId)
            await User.updateMany({teamId}, {teamId: "000000000000000000000000"})

            return team
        }catch (e) {
            console.log("error: ",e )
        }
    }

    async redact(teamId, data){
        try{
            const team = await Team.findByIdAndUpdate(teamId, data)

            return team
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAll(){
        try{
            const teams = await Team.find()

            return teams
        }catch (e) {
            console.log("error: ",e )
        }
    }

    async findAllStatusTrue(){
        try{
            const teams = await Team.find({status: true})

            return teams
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async addScore(teamId1, teamId2){
        const team1 = await Team.findById(teamId1)
        const team2 = await Team.findById(teamId2)

        if(!team1 || !team2){
            throw ApiError.notFound('!team1 || !team2')
        }

        const leagueId1 = await League.findById(team1.leagueId)
        const leagueId2 = await League.findById(team2.leagueId)

        if(leagueId1.toString() === leagueId2.toString()){
            team1.score = Number(team1.score) + Number(1)
            team2.score = Number(team2.score) + Number(1)

            await team1.save()
            await team2.save()
        }

        return ({team1Score: team1.score,team2Score: team2.score })

    }

}

module.exports = new teamController()