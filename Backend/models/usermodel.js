const mongoose = require('mongoose')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Please enter a username']
    },
    email:{
        type:String,
        required:[true,'Please enter an email'],
        Unique:true
    },
    password:{
        type:String,
        required:[true,'Please enter a password']
    }
},{timestamps:true}
)
module.exports = mongoose.model('User',userSchema)