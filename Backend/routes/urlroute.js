const express = require('express');
const { geturl, makenewurl } = require('../controllers/urlcontroller');
const {protect}=require('../middleware/authMiddleware')
const router = express.Router();

router.post('/',makenewurl);
router.get('/:shortId', geturl);
module.exports = router;