const db= require('../db/db')

const schema = new db.Schema({
    status: {
        type: Boolean,
        default: true
    },
    number: {
        type: Number,
        required: true
    },
    userId:{
        type: db.Schema.Types.ObjectId,
        required: true
    },
    leagueId:{
        type: db.Schema.Types.ObjectId,
        required:true
    },
    type: {
        type: String,
        required: true
    },
    cityId:{
        type: db.Schema.Types.ObjectId,
        required: true
    },
    total:{
        type: Number,
        required: true
    },
    part: {
        type: Number,
        default: 0
    },
    rate:{
        type: Number,
        required: true
    },
    deadline:{
        type: String,
        required: true
    },
    extraInfo: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    statusStage: {// open, reserved, fixed
        type: String,
        default: "open"
    },
    linkedChat: {
        type: db.Schema.Types.ObjectId,
        default: "000000000000000000000000"
    },
    channelMessageId: {
        type: Number,
        default: 0
    }
})

module.exports = db.model('Advertisement', schema)
