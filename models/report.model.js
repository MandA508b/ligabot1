const db= require('../db/db')

const schema = new db.Schema({
    chatId: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    advertisementId: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    userRole: {// client or customer
        type: String,
        required: true
    },
    numberOfRequest: {
        type: Number,
        default: 1
    }
})

module.exports = db.model('Report', schema)

