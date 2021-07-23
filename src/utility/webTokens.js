const jwt = require('jsonwebtoken')

var secretKey = 'testingjwtsecret'  //todo replace secret with environment variable

const generateToken = function (email) {
    return jwt.sign(email, secretKey)
}

const verifyToken = function (token){
    return jwt.verify(token, secretKey, (err, decode) => {
        if(err) {
            console.log('jwt error. cannot verify')
            return false
        }
        console.log('jwt verified')
        return true
    })
}

module.exports = {
    generateToken,
    verifyToken
}