const League = require('../../models/league.model')
const User = require('../../models/user.model')
const Team = require('../../models/team.model')

class leagueController{// userData: [{userId: _id, updateData: {..data to update..}}, ...]
    async create(name, level){
        const team = await League.create({name, level})

        return team
    }

    async getLeagueById(leagueId){
        const league = await League.findById(leagueId)
        return league
    }

    async delete(leagueId){
        const league = await League.findByIdAndDelete(leagueId)
        await User.updateMany({leagueId}, {leagueId: "000000000000000000000000"})
        await Team.updateMany({leagueId}, {leagueId: "000000000000000000000000"})

        return league
    }

    async redact(leagueId, data){
        console.log(leagueId, data)
        const team = await League.findByIdAndUpdate(leagueId, data)

        return team
    }

    async findAll(){    
        const leagues = await League.find()

        return leagues
    }

    async findAllStatusTrue(){
        const leagues = await League.find({status: true})

        return leagues
    }

}

module.exports = new leagueController()