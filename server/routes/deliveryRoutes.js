const express = require("express");
const { signup,login , getImage  } = require("../controllers/deliveryController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get('/get', getImage);
module.exports = router;
