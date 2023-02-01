const db= require('../db/db')

const schema = new db.Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    telegramId:{
        type: String,
        required: true,
        unique: true
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'User'
    },
    teamId: {
        type: db.Schema.Types.ObjectId,
        default: "000000000000000000000000"
    },
    leagueId: {
        type: db.Schema.Types.ObjectId,
        default: "000000000000000000000000"
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
})

module.exports = db.model('User', schema)