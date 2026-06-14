const express = require('express')
const router = express.Router()
const { registerUser, loginUser } = require('../controllers/usercontroller')
const { refreshToken } = require('../controllers/usercontroller')
const {protect}=require('../middleware/authMiddleware')
const { validateRegister, validateLogin, checkValidationErrors } = require('../utils/validateuserinfo')

router.post('/register', validateRegister, checkValidationErrors, registerUser)
router.post('/login', validateLogin, checkValidationErrors, loginUser)
router.post('/refresh', refreshToken)
// Get current user's urls
const { getUserUrls } = require('../controllers/usercontroller')
router.get('/urls', protect, getUserUrls)

module.exports = router