const express = require('express');
const async_handler = require('express-async-handler');
const Url = require('../models/Urlmodel');
const isValidUrl = require('../utils/validateurl.js');
    const { nanoid } = await import('nanoid');
// @desc Get url
// @route GET /shortner/:shortId
// @access Public
const geturl = async_handler(async (req, res) => {
    const { shortId } = req.params;
    const url=await Url.findOneandUpdate({shortId},
        {$inc:{clicks:1}},
        {new:true}
    ).exec();
    ValidateUrl(url);
    if(!url){
        res.status(404);
        throw new Error('Url not found');
    }
    if(url.expireAt&&url.expireAt<Date.now()){
        res.status(410);
        throw new Error('Url has expired');
    }
    res.redirect(301, url.originalUrl);
    
    

});


// @desc Make new url
// @route POST /shortner
// @access Public
const makenewurl = async_handler(async (req, res) => {
    const { originalUrl, customId, expireIn }=req.body;
    if(!originalUrl||!isValidUrl(originalUrl)){
        res.status(400);
        throw new Error('Please provide a valid url');
    }
        if(customId){
            const Custom_Id_Exists=await Url.findOne({shortId:customId});
            if(Custom_Id_Exists){
                res.status(400);
                throw new Error('Custom ID already exists');
            }
            if(customId.length>10){
                res.status(400);
                throw new Error('Custom ID should be less than 10 characters');
            }
            const newurl=await Url.create({
                originalUrl,
                shortId:customId,
                expireAt:expireIn?new Date(Date.now()+expireIn*60*60*1000):undefined
            })
            res.status(201).json({shortUrl: `${process.env.BASE_URL}/shortner/${newurl.shortId}`});
            return;

        }

    let newurl;
    let created = false;

    while (!created) {
    try {
    const shortId = nanoid(7);
    newurl = await Url.create({
      shortId,
      originalUrl: url
    });
    created = true;
  } catch (err) {
    if (err.code === 11000) {
        // Duplicate key error, generate a new shortId and try again
        continue;
    } else {
      throw err;
    }
  }
}
    
    res.status(201).json({shortUrl: `${process.env.BASE_URL}/shortner/${newurl.shortId}`});
}
);
ValidateUrl=(url)=>{
    const parsedUrl = new URL(url.originalUrl);
    if([!'http:','https:'].includes(parsedUrl.protocol)){
        res.status(400);
        throw new Error('Invalid URL protocol');
    }
    const blockedHosts = ['127.0.0.1', '0.0.0.0', '192.168','10.0','172.16','169.254']; //private IP ranges(add localhost in prod)
    if(blockedHosts.some(host=>parsedUrl.hostname.includes(host))){
        res.status(400)
        throw new Error('URL points to a blocked host');
    }
}
module.exports = { geturl, makenewurl };