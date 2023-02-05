const ChatData = require('../../models/chatData.model')

class chatDataController{

    async create(chatName, userName, messageText){
        const date = (new Date(Date.now())).toString()

        const chatData = await ChatData.create({chatName, userName, messageText, date})
        return chatData
    }

}

module.exports = new chatDataController()