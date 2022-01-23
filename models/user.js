const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        requried: true
    },
    password: {
        type: String,
        requried: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('User', userSchema)