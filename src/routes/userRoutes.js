const express = require('express')
const User = require('../model/user')
const bcrypt = require('bcrypt')
const { generateToken, verifyToken } = require('../utility/webTokens')
const constants = require('../utility/constants')
const route = express.Router()

// create new user
route.post('/users/create', async (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const pass = req.body.pass

    try {
        var user = await User.find({ email: email })
        if (user.length != 0) {
            return res.status(constants.user_already_exist).send('User already exist')
        }

        var hashPass = await bcrypt.hash(pass, 8)

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

route.post('/users/login', async (req, res) => {
    email = req.body.email
    givenPass = req.body.pass

    try {
        const user = await User.find({ email: email })
        console.log(user)
        if (user.length == 0) {
            res.status(constants.no_such_user).send('No such user')
        }
        const result = await bcrypt.compare(givenPass, user[0].hashPass)
        if (result == false) {
            return res.status(constants.login_unsuccessfull).send('Login unsuccessfull')
        }

        const token = generateToken(email)
        res.send(token)
    } catch (e) {
        res.status(400).send('error occured in login')
    }
})

module.exports = route