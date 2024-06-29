const express = require('express');
const router = express.Router();
const {signup ,login ,addItem , userInfo ,getItem ,itemDetail} = require('../controllers/sellerController');
const {sellerProtect } = require('../middlewares/authentication');
// Route for creating a new user
router.post('/signup', signup);
router.post('/login', login);
router.post('/addItem',sellerProtect, addItem);
router.get('/userInfo',sellerProtect, userInfo);
router.get('/getItem',sellerProtect, getItem);
router.get('/itemDetail',sellerProtect, itemDetail);

module.exports = router;