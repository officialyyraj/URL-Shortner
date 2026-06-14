const express = require('express');
const async_handler = require('express-async-handler');
const Url = require('../models/Urlmodel');
const {isValidUrl} = require('../utils/validateurl.js');

    const { nanoid } = require('nanoid');
// @desc Get url
// @route GET /shortner/:shortId
// @access Public
const geturl = async_handler(async (req, res) => {
    const { shortId } = req.params;
    const url=await Url.findOneAndUpdate({shortId},         //this version of increasing clicks then checking expiry can lead to a small window where clicks are increased for an expired url.
        {$inc:{clicks:1}},
        {new:true}
    ).exec();
    if(!url){
        res.status(404);
        throw new Error('Url not found');
    }
     if(url.expireAt&&new Date(url.expireAt)<new Date()){
        res.status(410);
        throw new Error('Url has expired');
    }
    ValidateUrl(url.originalUrl);
   
    res.redirect(302, url.originalUrl);

});


// @desc Make new url
// @route POST /shortner
// @access Public
const makenewurl = async_handler(async (req, res) => {
    const { originalUrl, customId, expireIn }=req.body;
        const cleanedurl = originalUrl.trim();
        const normalizedid = customId ? customId.trim().toLowerCase() : null;
    if(!cleanedurl||!isValidUrl(cleanedurl)){
        res.status(400);
        throw new Error('Please provide a valid url');
    }
        if(customId){
            if (!/^[a-zA-Z0-9_-]+$/.test(normalizedid)) {
            throw new Error('Invalid custom ID');
            }
            const Custom_Id_Exists=await Url.findOne({shortId:normalizedid}).exec();
            if(Custom_Id_Exists){
                res.status(400);
                throw new Error('Custom ID already exists');
            }
            if(customId.length>10){
                res.status(400);
                throw new Error('Custom ID should be less than 10 characters');
            }
            const newurl=await Url.create({
                originalUrl: cleanedurl,
                shortId:normalizedid,
                user: req.user ? req.user._id : undefined,
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
      originalUrl: cleanedurl,
            user: req.user ? req.user._id : undefined,
      expireAt: expireIn ? new Date(Date.now() + expireIn * 60 * 60 * 1000) : undefined,
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
const ValidateUrl=(originalUrl)=>{
    const parsedUrl = new URL(originalUrl);
    if(!['http:','https:'].includes(parsedUrl.protocol)){
        throw new Error('Invalid URL protocol');
    }
    const blockedHosts = ['127.0.0.1', '0.0.0.0', '192.168','10.0','172.16','169.254']; //private IP ranges(add localhost in prod)
    if(blockedHosts.some(host=>parsedUrl.hostname.startsWith(host))){
        throw new Error('URL points to a blocked host');
    }
}
module.exports = { geturl, makenewurl };