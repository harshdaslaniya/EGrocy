const sellerUser = require("../model/sellerModel");
const customerUser = require("../model/costumerModel");
const jwt = require("jsonwebtoken");

const sellerProtect = (req, res, next) => {
  try {
    const sellerToken = req.cookies.sellerToken;
    if (!sellerToken) {
      return res.status(500).json({ msg: "Not authorized, please login" ,type:"error"});
    }
    
    // Verify sellerToken
    const verified = jwt.verify(sellerToken, process.env.SECRET_KEY);

    // Get user id from token
    sellerUser.findById(verified.id).select("-password ")
      .then((user) => {
        if (!user) {
          res.status(500);
          throw new Error({ msg: "Not authorized, please login" ,type:"error"});
        }
        req.user = user;
        next();
      })
      .catch((error) => {
        res.status(500);
        throw new Error({ msg: "Not authorized, please login" ,type:"error"});
      });
  } catch (error) {
    res.status(500);
    throw new Error({ msg: "Not authorized, please login" ,type:"error"});
  }
};
const customerProtect = (req, res, next) => {
  try {
    const customerToken = req.cookies.customerToken;
    if (!customerToken) {
      return res.status(500).json({ msg: "1Not authorized, please login" ,type:"error"});
    }
    
    // Verify sellerToken
    const verified = jwt.verify(customerToken, process.env.SECRET_KEY);

    // Get user id from token
    customerUser.findById(verified.id).select("-password ")
      .then((user) => {
        if (!user) {
          res.status(500);
          throw new Error({ msg: "Not authorized, please login" ,type:"error"});
        }
        req.user = user;
        next();
      })
      .catch((error) => {
        res.status(500);
        throw new Error({ msg: "Not authorized, please login" ,type:"error"});
      });
  } catch (error) {
    res.status(500);
    throw new Error({ msg: "Not authorized, please login" ,type:"error"});
  }
};

module.exports = {sellerProtect ,customerProtect};
