const User = require('../../models/user.model')
const teamService = require('../services/team.service')

class UserController{// userData: [{userId: _id, updateData: {..data to update..}}, ...]

    async getAllUsers(){
        const users = await User.find()

        return users
    }

    async updateUsers(userData){
        let users = []
        for (let userDataKey in userData) {
            if(userData[userDataKey].updateData.teamId){
                const team = await teamService.findTeamById(userData[userDataKey].updateData.teamId)
                users.push(await User.findOneAndUpdate({_id: userData[userDataKey].userId}, {...userData[userDataKey].updateData, leagueId: team.leagueId}))
            }else{
                users.push(await User.findOneAndUpdate({_id: userData[userDataKey].userId}, userData[userDataKey].updateData))
            }

        }

        return users
    }

    async getUserByTelegramId(telegramId){
        const user = await User.findOne({telegramId})

        return user
    }


}

module.exports = new UserController()