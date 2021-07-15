const express = require('express')
require('./src/db/mongoose')
const Product = require('./src/model/product')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.get('/products/get', async (req, res) => {
    try{
        const products = await Product.find({})
        res.send(products)
    } catch (e) {
        res.status(400).send(e)
        console.log('error in getting product')
    }
})

//search terms
app.get('/products/search/:searchterm', async (req, res) => {
    const terms = req.params.searchterm.split(' ')
    const searcharray = terms.map(term => {
        return {name: new RegExp(term, 'i')}
    })

    try {
        const products = await Product.find().or(searcharray).limit(20)
        res.send(products)
    } catch (e) {
        res.status(400).send('Issue occured in searching')
    }
})

// create new product
app.post('/products/create', async (req, res) => {
    const prod = Product({ ...req.body })
    try {
        await prod.save()
        res.status(200).send(prod)
    } catch (e) {
        console.log('error in creating new product')
        res.status(400).send(e)
    }
})

//delete all products
app.delete('/products/deleteAll', async (req, res) => {
    try {
        await Product.deleteMany({})
        res.status(200).send('Deleted all products')
    } catch (e) {
        res.send(400).send('issue in deleting all products')
    }
})

//update existing product
app.patch('/products/edit')

app.listen(port, () => {
    console.log('app running on port', port)
})