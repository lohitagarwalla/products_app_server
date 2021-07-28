const express = require('express')
require('./src/db/mongoose')
const Product = require('./src/model/product')
const bcrypt = require('bcrypt')
const User = require('./src/model/user')
const { generateToken, verifyToken } = require('./src/utility/webTokens')
const ItemNo = require('./src/model/itemNo')

const app = express()
const port = process.env.PORT || 3000

// app.use(express.json())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

const server_error_occured = 500

const user_already_exist = 900
const no_such_user = 901
const login_unsuccessfull = 902

const no_such_product = 801

app.get('/', (req, res) => {
    res.send('Hello world')
})

// create new user
app.post('/users/create', async (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const pass = req.body.pass

    try {
        var user = await User.find({ email: email })
        if (user.length != 0) {
            return res.status(user_already_exist).send('User already exist')
        }

        hashPass = await bcrypt.hash(pass, 8)

        user = User({
            ...req.body
        })
        user.hashPass = hashPass
        user = await user.save()

        const token = generateToken(email)

        res.send(token)
    } catch (e) {
        res.status(400).send('Error in creating user')
    }
})

app.post('/users/login', async (req, res) => {
    email = req.body.email
    givenPass = req.body.pass

    try {
        const user = await User.find({ email: email })
        console.log(user)
        if (user.length == 0) {
            res.status(no_such_user).send('No such user')
        }
        const result = await bcrypt.compare(givenPass, user[0].hashPass)
        if (result == false) {
            return res.status(login_unsuccessfull).send('Login unsuccessfull')
        }

        const token = generateToken(email)
        res.send(token)
    } catch (e) {
        res.status(400).send('error occured in login')
    }
})

app.get('/products/get', async (req, res) => {
    try {
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
        return { name: new RegExp(term, 'i') }
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
app.delete('/products/deleteAll', async (req, res) => {
    try {
        await Product.deleteMany({})
        res.status(200).send('Deleted all products')
    } catch (e) {
        res.send(400).send('issue in deleting all products')
    }
})

app.delete('/products/delete/:itemNo', async (req, res) => {
    const itemNo = req.params.itemNo

    try {
        const product = await Product.deleteOne({ itemNo: itemNo })
        if (product == null) {
            return res.status(no_such_product).send('no_such_product')
        }
        return res.send('Product deleted successfully')
    } catch (e) {
        res.status(server_error_occured).send('server_error_occured')
    }
})

app.patch('/products/update/:itemNo', async (req, res) => {
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

//update existing product
app.patch('/products/edit')

app.listen(port, () => {
    console.log('app running on port', port)
})