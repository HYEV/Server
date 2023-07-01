const express = require('express')
const router = express.Router()
const {registerUser, loginUser,logoutUser, userData, updateprof} = require('../Controllers/userController')
const {protect} = require('../middleware/authMiddleware')


router.post('/', registerUser);

router.post('/login', loginUser);

router.post('/logout', logoutUser);

router.route('/profile').get(protect, userData).put(protect, updateprof);

module.exports = router