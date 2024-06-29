const express = require('express');
const router = express.Router();
const {signup ,login,getItem , itemDetail} = require('../controllers/customerController');
const{customerProtect} = require('../middlewares/authentication')
// Route for creating a new user
router.post('/signup', signup);
router.post('/login', login);
router.get('/getItem',customerProtect, getItem);
router.get('/itemDetail',customerProtect, itemDetail);

module.exports = router;