const Channel = require('../../models/chennal.model')

class channelController{

    async create(channelId, number, leagueId, URL){
        const channel = await Channel.create({channelId, number, leagueId, URL})

        return channel
    }

    async delete(channelId){
        const channel = await Channel.findByIdAndDelete(channelId)

        return channel
    }

    async redact(channelId, data){
        const channel = await Channel.findByIdAndUpdate(channelId, data)

        return channel
    }

    async findAll(){
        const channels = await Channel.find()

        return channels
    }

    async getAllByLeagueId(leagueId){
        const channels = await Channel.find(leagueId)//TODO

        return channels
    }

    async getByLeagueId(leagueId){
        const channel = await Channel.findOne({leagueId})

        return channel
    }

}

module.exports = new channelController()