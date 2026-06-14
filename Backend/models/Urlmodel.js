const mongoose = require('mongoose');

const urlSchema =new mongoose.Schema({
    originalUrl:{
        type:String,
        required:true,
        index:true
    },
    shortId:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        index: true
    },
    clicks:{
        type:Number,
        default:0,
        index:true
    },
    expireAt:{
        type:Date,
        default:undefined,
        index:{expireAfterSeconds:0}

    }

},{timestamps:true}
)
const Url = mongoose.model('Url',urlSchema)

module.exports = Url;
