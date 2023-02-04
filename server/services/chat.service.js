const Chat = require('../../models/chat.model')

class chatService{

        async create(advertisementId, customerId, clientId){
        const candidate = await Chat.findOne({advertisementId, customerId, clientId})
        if(candidate){
            return candidate
        }
        const room = "" + advertisementId + customerId + clientId
        const chat = await Chat.create({advertisementId, customerId, clientId, room})

        return chat
    }

    async delete(chatId){
        const chat = await Chat.findByIdAndDelete(chatId)

        return chat
    }

    async findAll(){
        const chats = await Chat.find()

        return chats
    }

    async getByUserId(userId){
        const chat = await Chat.findOne({userId})

        return chat
    }

    async getAllByCustomerId(userId){
        const chats = await Chat.find({ customerId: userId})

        return chats
    }

    async getAllByClientId(userId){
        const chats = await Chat.find({ clientId: userId})

        return chats
    }
}

module.exports = new chatService()