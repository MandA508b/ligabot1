const db= require('../db/db')

const schema = new db.Schema({
    chatId: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    advertisementId: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    rate: {
        type: Number,
        required: true
    }
})

module.exports = db.model('RequestRate', schema)