const Chat = require('../../models/chat.model')

class chatService{

        async create(advertisementId, customerId, clientId){
        try{
            const candidate = await Chat.findOne({advertisementId, customerId, clientId})
            if(candidate){
                return candidate
            }
            const room = "" + advertisementId + customerId + clientId
            const chat = await Chat.create({advertisementId, customerId, clientId, room})

            return chat
        }catch (e) {
            console.log("error: ",e)
        }
    }

    async delete(chatId){
        try{
            const chat = await Chat.findByIdAndDelete(chatId)

            return chat
        }catch (e) {
            console.log("error: ",e )
        }
    }

    async findAll(){
        try{
            const chats = await Chat.find()

            return chats
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async getByUserId(userId){
        try{
            const chat = await Chat.findOne({userId})

            return chat
        }catch (e) {
            console.log("error: ",e)
        }
    }

    async getAllByCustomerId(userId){
        try{
            const chats = await Chat.find({ customerId: userId})

            return chats
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async getAllByClientId(userId){
        try{
            const chats = await Chat.find({ clientId: userId})

            return chats
        }catch (e){
            console.log("error: ", e)
        }
    }
}

module.exports = new chatService()