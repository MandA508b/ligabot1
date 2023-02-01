const userService  = require('../services/user.service')
const ApiError = require(`../errors/api.error`)

class UserController{

    async getAllUsers(req, res, next){
        const users = await userService.getAllUsers()

        return res.json(users)
    }

    async updateUsers(req, res, next){// userData: [{userId: _id, updateData: {..data to update..}}, ...]
        const {userData} = req.body
        if(!userData){
            return next(ApiError.badRequest('!userData'))
        }
        const user = await userService.updateUsers(userData)

        return res.json({user})
    }

    async getUserByTelegramId(req, res, next){
        const {telegramId} = req.body
        if(!telegramId){
            return next(ApiError.badRequest('!telegramId'))
        }
        const user = await userService.getUserByTelegramId(telegramId)

        return res.json({user})
    }

}

module.exports = new UserController()