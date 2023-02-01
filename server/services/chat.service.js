const Chat = require('../../models/chat.model')

class chatController{

    async create(advertisementId, customerId, clientId){
        const candidate = await Chat.findOne({advertisementId, customerId, clientId})
        if(candidate){
            return candidate
        }
        const chat = await Chat.create({advertisementId, customerId, clientId})

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

    async getByUserId(chatId){
        const chat = await Chat.findOne({chatId})

        return chat
    }

}

module.exports = new chatController()