const express = require('express')
const router = express.Router()
const { registerUser, loginUser } = require('../controllers/usercontroller')
const { validateRegister, validateLogin, checkValidationErrors } = require('../utils/validateuserinfo')

router.post('/register', validateRegister, checkValidationErrors, registerUser)
router.post('/login', validateLogin, checkValidationErrors, loginUser)

module.exports = router