const Team = require('../../models/team.model')
const User = require("../../models/user.model");

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

}

module.exports = new teamController()