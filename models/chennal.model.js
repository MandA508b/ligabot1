const db= require('../db/db')

const schema = new db.Schema({
    channelId: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    leagueId: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    URL: {
        type: String,
        required: true
    }
})

module.exports = db.model('Channel', schema)