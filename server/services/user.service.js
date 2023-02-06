const User = require('../../models/user.model')
const teamService = require('../services/team.service')

class UserController{// userData: [{userId: _id, updateData: {..data to update..}}, ...]

    async getAllUsers(){
        try{
            const users = await User.find()

            return users
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async updateUsers(userData){
        try{
            let users = []
            for (let userDataKey in userData) {
                if(userData[userDataKey].updateData.teamId){
                    const team = await teamService.findTeamById(userData[userDataKey].updateData.teamId)
                    const user = await User.findOneAndUpdate({_id: userData[userDataKey].userId}, {...userData[userDataKey].updateData, leagueId: team.leagueId})
                    users.push(user)
                }else{
                    const user = await User.findOneAndUpdate({_id: userData[userDataKey].userId}, userData[userDataKey].updateData)
                    users.push(user)
                }

            }

            return users
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async getUserByTelegramId(telegramId){
        try{
            const user = await User.findOne({telegramId})

            return user
        }catch (e) {
            console.log("error: ", e)
        }

    }

    async getUserById(userId){
        try{
            const user = await User.findById(userId)

            return user
        }catch (e) {
            console.log("error: ", e)
        }
    }


}

module.exports = new UserController()