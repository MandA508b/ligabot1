const db= require('../db/db')

const schema = new db.Schema({
    login:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    }
})

module.exports = db.model('Admin', schema)