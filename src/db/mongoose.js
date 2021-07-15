const mongoose = require('mongoose')
const mongodburl = require('../config/file')

mongoose.connect(mongodburl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Mongodb connected')
    })
    .catch(e => {
        console.log(e)
        console.log('Error in connection mongodb')
    })