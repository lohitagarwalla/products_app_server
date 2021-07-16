const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    imageString: {
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
    },
    itemNo: {
        type: int,
    }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product