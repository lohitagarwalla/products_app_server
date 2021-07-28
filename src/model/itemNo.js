const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    itemNo: {
        type: Number
    }
})

const ItemNo = mongoose.model('ItemNo', itemSchema)

module.exports = ItemNo