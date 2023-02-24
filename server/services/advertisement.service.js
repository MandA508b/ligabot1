const Advertisement = require('../../models/advertisement.model')
const userService = require('../services/user.service')
const chatService = require('./chat.service')

class advertisementController{

    async create(userId,leagueId,type,cityId,total,part,rate,deadline,extraInfo){
        try{
            const Advertisements = await Advertisement.find()
            let number = 1
            if(Advertisements.length)
            number = Number(Advertisements[Advertisements.length-1].number) + Number(1)

            const advertisement = await Advertisement.create({number,userId,leagueId,type,cityId,total,part,rate,deadline,extraInfo})

            return advertisement
        }catch (e){
            console.log("error: ",e)
        }
    }

    async addChannelMessageId(channelMessageId, advertisementId){
        const advertisement = await Advertisement.findByIdAndUpdate(advertisementId, channelMessageId)

        return advertisement
    }

    async delete(advertisementId){
        try{
            const advertisement = await Advertisement.findByIdAndDelete(advertisementId)
            const chats = await chatService.getByAdvertisementId(advertisementId)

            for (let chatsKey in chats) {
                await chatService.delete(chats[chatsKey]._id)
            }

            return advertisement
        }catch (e) {
            console.log("error: ",e)
        }
    }

    async redact(advertisementId, data) {
        try{
            const advertisement = await Advertisement.findByIdAndUpdate(advertisementId, data)

            return advertisement
        }catch (e) {
            console.log("error: ",e)
        }
    }

    async findAll(){
        try{
            const advertisements = await Advertisement.find()

            return advertisements
        }catch (e) {
            console.log("error: ",e)
        }
    }

    async getAllByTelegramId(telegramId){
        try{
            const user = await userService.getUserByTelegramId(telegramId)
            const advertisements = await Advertisement.find({userId: user._id})

            return advertisements
        }catch (e) {
            console.log("error: ", e)
        }
    }
    async getById(advertisementId){
        try{
            const advertisement = await Advertisement.findById(advertisementId)

            return advertisement
        }catch (e) {
            console.log("error: ",e)
        }
    }

    async deleteByNumber(number){
       try{
           await Advertisement.deleteOne({number})
       }catch (e) {
           console.log("error:", e)
       }
    }

    async getByNumber(number){
        try{
            const advertisement = await Advertisement.findOne({number})

            return advertisement
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async switchStatusStage(advertisementId, statusStage, linkedChat){
        const advertisement = await Advertisement.findOneAndUpdate({_id: advertisementId}, {statusStage, linkedChat})
        console.log({advertisement})
        return advertisement
    }

}

module.exports = new advertisementController()