const jwt = require('jsonwebtoken')
const User = require('../models/usermodel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const e = require('express')
// @desc Register a new user
// @route POST /users/register
// @access Public
const registerUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body
    //check if all fields are filled
    if(!username||!email||!password){
        res.status(400)
        throw new Error('Please fill all the fields')
    } 
    //check if user already exists
    const userExists=await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }
    //Hash password
    const salt= await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)
    //create user
    const user=await User.create({
        username,
        email,
        password:hashedPassword
    })
    if(user){
        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken()
        user.refreshTokens.push(refreshToken)
        await user.save()
        res.status(201).json({
            _id:user._id,
            username:user.username,
            email:user.email,
            token:accessToken,
            refreshToken
        })
    }
    else{
        res.status(400)
        throw new Error('Invalid user data')
    }

})
// @desc Authenticate a user
// @route POST /users/login
// @access Public
const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        res.status(400)
        throw new Error('Please fill all the fields')
    }
    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken()
        user.refreshTokens.push(refreshToken)
        await user.save()
        res.json({
            _id:user._id,
            username:user.username,
            email:user.email,
            token:accessToken,
            refreshToken
        })
    }
    else{
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

const generateAccessToken=(Id)=>{
    return jwt.sign({id: Id},process.env.JWT_SECRET,{
        expiresIn:'15m'
    })
}

const generateRefreshToken=()=>{
    return jwt.sign({rand: Math.random()},process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,{
        expiresIn:'7d'
    })
}

const verifyRefreshToken=(token)=>{
    try{
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
    }catch(err){
        return null
    }
}
module.exports={
    registerUser,
    loginUser
}
// Refresh token handler
const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body
    if(!refreshToken){
        return res.status(400).json({ message: 'Refresh token required' })
    }
    const payload = verifyRefreshToken(refreshToken)
    if(!payload){
        return res.status(401).json({ message: 'Invalid refresh token' })
    }
    // find user who has this refresh token
    const user = await User.findOne({ refreshTokens: refreshToken })
    if(!user) return res.status(401).json({ message: 'Invalid refresh token' })
    // issue new access token
    const accessToken = generateAccessToken(user._id)
    res.json({ token: accessToken })
})

module.exports = { registerUser, loginUser, refreshToken }

// Get URLs for current user
const Url = require('../models/Urlmodel')
const getUserUrls = asyncHandler(async (req, res) => {
    if(!req.user) return res.status(401).json({ message: 'Not authorized' })
    const urls = await Url.find({ user: req.user._id }).sort({ createdAt: -1 }).lean()
    res.json({ urls })
})

module.exports = { registerUser, loginUser, refreshToken, getUserUrls }
