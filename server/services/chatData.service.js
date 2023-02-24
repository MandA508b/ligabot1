const ChatData = require('../../models/chatData.model')

class chatDataController{

    async create(chatName, userName, messageText){
        try{
            const date = (new Date(Date.now())).toString()

            const chatData = await ChatData.create({chatName, userName, messageText, date})
            return chatData
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async deleteByChatName(chatName){
        await ChatData.deleteMany({chatName})
    }

}

module.exports = new chatDataController()