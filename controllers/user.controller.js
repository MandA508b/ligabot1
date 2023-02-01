const User = require('../models/user.model')

class UserController{
    async start(data){
        try{
            const candidate = await User.findOne({telegramId: data.id})
            if(candidate){
                return false
            }
            let name = data.first_name
            if(data.last_name){
                name = name + ' ' + data.last_name
            }
            const user = await User.create({
                name: name,
                telegramId: data.id,
                username: data.username
            })
            return true
        }catch (e) {
            console.log(e)
        }
    }

    async accessToMenu(telegramId){
        const user = await User.findOne({telegramId})
        if(!user){
            console.log('user does`t exist')
            return false
        }
        if(user.status && user.leagueId != '000000000000000000000000'){
            return true
        }
        return false
    }

}

module.exports = new UserController()