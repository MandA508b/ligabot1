const League = require('../../models/league.model')
const User = require('../../models/user.model')
const Team = require('../../models/team.model')

class leagueController{// userData: [{userId: _id, updateData: {..data to update..}}, ...]
    async create(name, level){
        try{
            const team = await League.create({name, level})

            return team
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async getLeagueById(leagueId){
        try{
            const league = await League.findById(leagueId)
            return league
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async delete(leagueId){
        try{
            const league = await League.findByIdAndDelete(leagueId)
            await User.updateMany({leagueId}, {leagueId: "000000000000000000000000"})
            await Team.updateMany({leagueId}, {leagueId: "000000000000000000000000"})

            return league
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async redact(leagueId, data){
        try{
            const team = await League.findByIdAndUpdate(leagueId, data)

            return team
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAll(){    
        try{
            const leagues = await League.find()

            return leagues
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAllStatusTrue(){
        try{
            const leagues = await League.find({status: true})

            return leagues
        }catch (e) {
            console.log("error: ", e)
        }
    }

}

module.exports = new leagueController()