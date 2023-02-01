const db= require('../db/db')

const schema = new db.Schema({
    userId:{
        type: db.Schema.Types.ObjectId
    },
    refreshToken:{
        type: String,
        required: true
    }
})

module.exports = db.model('Token', schema)

