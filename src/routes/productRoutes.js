const express = require('express')
const Product = require('../model/product')
const constants = require('../utility/constants')
const ItemNo = require('../model/itemNo')
const route = express.Router()

route.get('/products/get', async (req, res) => {
    var skipUpTo = req.query.skip
    if(skipUpTo == undefined) skipUpTo = 0
    skipUpTo = parseInt(skipUpTo)

    try {
        const products = await Product.find({}).limit(10).skip(skipUpTo)
        res.send(products)
    } catch (e) {
        res.status(400).send(e)
        console.log('error in getting product')
    }
})

//search terms
route.get('/products/search/:searchterm', async (req, res) => {
    const terms = req.params.searchterm.split(' ')
    const searcharray = terms.map(term => {
        return { name: new RegExp(term, 'i') }
    })

    var skipUpTo = req.query.skip
    if(skipUpTo == undefined) skipUpTo = 0
    skipUpTo = parseInt(skipUpTo)

    try {
        const products = await Product.find().or(searcharray).limit(10).skip(skipUpTo)
        res.send(products)
    } catch (e) {
        res.status(400).send('Issue occured in searching')
    }
})

route.get('/products/searchcategory/:category', async (req, res) => {
    const category = req.params.category
    console.log(category)

    var skipUpTo = req.query.skip
    if(skipUpTo == undefined) skipUpTo = 0
    skipUpTo = parseInt(skipUpTo)

    try {
        var products = await Product.find({category: category}).limit(10).skip(skipUpTo)
        res.send(products)
    } catch (e) {
        res.send(500).send('Issue in serching product according to category')
    }
})

// create new product
route.post('/products/create', async (req, res) => {
    const prod = Product({ ...req.body })

    try {
        var itemArr = await ItemNo.find({})
        var item = itemArr[0]

        item.itemNo++
        const newItemNo = item.itemNo
        prod.itemNo = newItemNo

        await prod.save()
        await item.save()

        res.status(200).send(prod)
    } catch (e) {
        console.log('error in creating new product')
        res.status(400).send(e)
    }
})

//delete all products
route.delete('/products/deleteAll', async (req, res) => {
    try {
        // await Product.deleteMany({})
        res.status(200).send('Deleted all products')
    } catch (e) {
        res.send(400).send('issue in deleting all products')
    }
})

route.delete('/products/delete/:itemNo', async (req, res) => {
    const itemNo = req.params.itemNo

    try {
        const product = await Product.deleteOne({ itemNo: itemNo })
        if (product == null) {
            return res.status(constants.no_such_product).send('no_such_product')
        }
        return res.send('Product deleted successfully')
    } catch (e) {
        res.status(constants.server_error_occured).send('server_error_occured')
    }
})

route.patch('/products/update/:itemNo', async (req, res) => {
    const itemNo = req.params.itemNo;

    const updateKeys = Object.keys(req.body)
    const allowedKeys = ['name', 'description', 'price', 'category', 'imageString'];

    try {
        var product = await Product.findOne({ itemNo: parseInt(itemNo) });
        if (product == null) {
            res.send('no such product');
            return
        }

        updateKeys.forEach(key => {
            if (allowedKeys.includes(key)) { product[key] = req.body[key] }
        })

        const updatedProduct = await product.save()

        res.send(updatedProduct);
    } catch (e) {
        res.status(201).send('Error in server. Cannot update product')
    }
})

module.exports = route