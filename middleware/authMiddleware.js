const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../model/Usermodel')

JWT_SECRET = "shawarmawithhummus"

const protect = asyncHandler(async (req, res, next) => {
    let token
    token = req.cookies.jwt

    if(token){
        try {
            const decoded = jwt.verify(token, JWT_SECRET)
            req.user = await User.findById(decoded.userId).select('-password')
            next()
        } catch (error) {
            res.status(401)
            throw new Error('Invalid token, not authorized')
        }
    }
    if(!token){
        res.status(402)
        throw new Error('Not authorised, no token')
    }
}) 

module.exports = { protect }