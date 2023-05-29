const express = require('express')
const router = express.Router()
const {registerUser, loginUser,logoutUser, userData} = require('../Controllers/userController')
const {protect} = require('../middleware/authMiddleware')

router.post('/', registerUser)

router.post('/login', loginUser)

router.post('/logout', logoutUser)

router.get('/profile', protect, userData)

module.exports = router