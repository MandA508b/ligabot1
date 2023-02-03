const ChatData = require('../../models/chatData.model')

class chatDataController{

    async create(chatName, userName, messageText){
        const chatData = await ChatData.create({chatName, userName, messageText})

        return chatData
    }

}

module.exports = new chatDataController()