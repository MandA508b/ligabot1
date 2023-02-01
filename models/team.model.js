const db= require('../db/db')

const schema = new db.Schema({
    status: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true
    },
    leagueId: {
        type: db.Schema.Types.ObjectId,
        required: true
    }
})

module.exports = db.model('Team', schema)

