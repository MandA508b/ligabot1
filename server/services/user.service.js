const User = require('../../models/user.model')

class UserController{// userData: [{userId: _id, updateData: {..data to update..}}, ...]

    async getAllUsers(){
        const users = await User.find()//TODO: one or many?

        return users
    }

    async updateUsers(userData){
        let users = []
        for (let userDataKey in userData) {
            users.push(await User.findOneAndUpdate({_id: userData[userDataKey].userId}, userData[userDataKey].updateData))
        }

        return users
    }

    async getUserByTelegramId(telegramId){
        const user = await User.findOne({telegramId})

        return user
    }

    async getUserByTelegramID(telegramId){
        const user = await User.findOne({telegramId})

        return user
    }

}

module.exports = new UserController()