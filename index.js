const express = require('express')
const mongoose = require('mongoose')
const mongodburl = require('./source/config/file')

const app = express()
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


const port = 3000

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.get('/get/products', (req, res) => {
    res.send('all products sent.')
})

app.listen(port, () => {
    console.log('app running on port', port)
})