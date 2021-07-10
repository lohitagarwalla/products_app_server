const express = require('express')
const mongoose = require('mongoose')

const app = express()

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