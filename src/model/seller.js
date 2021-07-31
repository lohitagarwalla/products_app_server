const mongoose = require('mongoose')

const sellerSchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    hashPass: {
        type: String,
        required: true
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
})

const Seller = mongoose.model('Seller', sellerSchema)

module.exports = Seller