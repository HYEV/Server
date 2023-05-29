const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../model/Usermodel')

const NODE_ENV = 'development'

JWT_SECRET = "shawarmawithhummus"

const registerUser = asyncHandler(async(req, res) => {
    const{ name, age, username, email, password, phnum} = req.body

    const userExists = await User.findOne({email})
    const usernameExists = await User.findOne({username})
    if(userExists){
        res.status(400)
        throw new Error('User exists')
    }
    if(usernameExists){
        res.status(400)
        throw new Error('Username taken')
    }
    
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        age,
        username,
        email,
        password: hashedPass,
        phnum,

    })
    if(user){
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    } else{
        res.status(400)
        throw new Error('User invalid')
    }
})
// pass: 723hshds
//username: muzzz1
//email: mam77am@gmail.com
const loginUser = asyncHandler(async(req, res) => {
    const{ username, password} = req.body
    const user = await User.findOne({username})

    if(user && (await bcrypt.compare(password, user.password))){
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    } else{
        res.status(401)
        throw new Error('Credentials invalid')
    }
})

const logoutUser = asyncHandler(async(req, res) => {
    res.cookie('jwt', '', {
        httpOnly:true,
        expires: new Date(0),
    })
    res.status(200).json({message: 'User logged out'})
})

const userData = asyncHandler(async(req, res) => {
    const user = {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
    }
    res.status(200).json(user)
})

const generateToken = (res, userId) => {
    const token = jwt.sign({userId}, JWT_SECRET, {
        expiresIn:'30d',
    })

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
}

module.exports = {
    registerUser,
    loginUser,
    userData,
    logoutUser,
}