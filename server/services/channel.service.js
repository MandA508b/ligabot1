const Channel = require('../../models/chennal.model')

class channelController{

    async create(channelId, number, leagueId, URL){
       try{
           const channel = await Channel.create({channelId, number, leagueId, URL})

           return channel
       }catch (e) {
            console.log("error: ", e)
       }
    }

    async delete(channelId){
        try{
            const channel = await Channel.findByIdAndDelete(channelId)

            return channel
        }catch (e) {
            console.log("error: ",e)
        }
    }

    async redact(channelId, data){
        try{
            const channel = await Channel.findByIdAndUpdate(channelId, data)

            return channel
        }catch (e) {
            console.log("error: ",e)
        }
    }

    async findAll(){
        try{
            const channels = await Channel.find()

            return channels
        }catch (e) {
            console.log(e)
        }
    }

    async getByLeagueId(leagueId){
        try{
            const channel = await Channel.findOne({leagueId})

            return channel
        }catch (e) {
            console.log("error: ", e)
        }
    }

}

module.exports = new channelController()