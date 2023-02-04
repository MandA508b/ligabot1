const Team = require('../../models/team.model')
const User = require("../../models/user.model");

class teamController{

    async findByLeagueId(leagueId){
        const teams = Team.find({leagueId})
        return teams
    }
    async findTeamsByLeagueId(leagueId){
        const teams = await Team.find({leagueId})
        return teams
    }
    async findTeamById(id){
        const team = await Team.findById(id)
        return team
    }
    async create(name, leagueId){
        const team = await Team.create({name, leagueId})

        return team
    }

    async delete(teamId){
        const team = await Team.findByIdAndDelete(teamId)
        await User.updateMany({teamId}, {teamId: "000000000000000000000000"})

        return team
    }

    async redact(teamId, data){
        const team = await Team.findByIdAndUpdate(teamId, data)

        return team
    }

    async findAll(){
        const teams = await Team.find()

        return teams
    }

    async findAllStatusTrue(){
        const teams = await Team.find({status: true})

        return teams
    }

}

module.exports = new teamController()