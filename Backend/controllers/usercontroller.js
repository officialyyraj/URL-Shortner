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
        res.status(201).json({
            _id:user._id,
            username:user.username,
            email:user.email,
            token:generateToken(user._id)
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
        res.json({
            _id:user._id,
            username:user.username,
            email:user.email,
            token:generateToken(user._id)
        })
    }
    else{
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

const generateToken=(Id)=>{
    return jwt.sign({Id},process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
}
module.exports={
    registerUser,
    loginUser
}
