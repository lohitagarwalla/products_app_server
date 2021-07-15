const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    imageStrin: {
        type: String,
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
    }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product