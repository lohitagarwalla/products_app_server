const express = require('express')
const Seller = require('../model/seller')
const { generateToken, verifyToken } = require('../utility/webTokens')
const constants = require('../utility/constants')
const bcrypt = require('bcrypt')
const route = express.Router()


route.post('/seller/create', async (req, res) => {
    const companyName = req.body.companyName
    const name = req.body.name
    const email = req.body.email
    const phone = req.body.phone
    const pass = req.body.pass

    try {
        var seller = await Seller.find({ email: email })
        if (seller.length != 0) {
            return res.status(constants.user_already_exist).send('Seller already exist')
        }

        var hashPass = await bcrypt.hash(pass, 8)

        seller = Seller({
            ...req.body
        })
        seller.hashPass = hashPass
        seller = await seller.save()

        const token = generateToken(email)

        res.send(token)
    } catch (e) {
        res.status(400).send('Error in creating user')
    }
})

route.post('/seller/login', async (req, res) => {
    email = req.body.email
    givenPass = req.body.pass

    try {
        const seller = await Seller.find({ email: email })
        if (seller.length == 0) {
            res.status(constants.no_such_user).send('No such seller')
        }

        const result = await bcrypt.compare(givenPass, seller[0].hashPass)
        if (result != true) {
            return res.status(constants.login_unsuccessfull).send('Login unsuccessfull')
        }

        const token = generateToken(email)

        res.send(token)
    } catch (e) {
        res.status(400).send('error occured in login')
    }
})

module.exports = route
