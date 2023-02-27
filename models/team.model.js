const db= require('../db/db')

const schema = new db.Schema({
    status: {
        type: Boolean,
        default: true
    },
    name: {
        type: String,
        required: true
    },
    leagueId: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    score :{
        type:Number,
        default: 0
    }
})

module.exports = db.model('Team', schema)

