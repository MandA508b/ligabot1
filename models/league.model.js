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
    level: {
        type: String,
        required: true
    }
})

module.exports = db.model('League', schema)

