const costumerModel = require("../model/costumerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sellerItemModel = require("../model/sellerItemModel");
const fs = require('fs');



// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id },process.env.SECRET_KEY, { expiresIn: "1d" });
};



//  signup ***************************************************************************************************************
const signup = async (req, res) => {
  try {
    const{ name ,email, password , phone , address} = req.body;

    if (!name || !email || !password || !phone || !address ) {
      return res.status(400).json({ msg: 'Please fill in all required fields', type: 'warning' });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be up to 6 characters', type: 'warning' });
    }

    const userExists = await costumerModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'Email has already been registered', type: 'warning' });
    }
    const user = new  costumerModel({
      name,
      email,
      password,
      phone, 
      address,
    });
     // Generate token
    const token = generateToken(user._id);
    res.header('Access-Control-Allow-Credentials', true);
    const newCookieName = `customerToken`;
    res.cookie(newCookieName, token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });
    // Save token to user
    user.token.push({ token });
    

    const data = await user.save();
    if (data) {
      res.status(201).json({ msg: 'Data stored successfully', type: 'success' });
    } else {
      res.status(400).json({ msg: 'Something Wrong', type: 'warning' });
      throw new Error("Invalid user data");
    }
  } catch (error) {
    // Handle the error and send an appropriate response
    res.status(500).json({ msg: 'An error occurred'  , type: 'error'});
  }
};

// ***************************** login ********************************************

const login = async(req , res ) => {
   try {
    const{email , password} = req.body;
    // verify all field or Not
    if (!email || !password ) {
      return res.status(400).json({ msg: 'Please fill in all required fields', type: 'warning' });
    }
    // verify user signup or Not
    const userExists = await costumerModel.findOne({ email });
    if (!userExists ) {
      return res.status(400).json({ msg: 'User not registered', type: 'warning' });
    }
    const passwordCorrect = await bcrypt.compare(password, userExists.password);
    if(!passwordCorrect){
      return res.status(400).json({ msg: 'Password not match', type: 'warning' });
    }
    else{
      const token = generateToken(userExists._id);
      res.header('Access-Control-Allow-Credentials', true);
      const newCookieName = `customerToken`;
      res.cookie(newCookieName, token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({ msg: 'Successfully login', type: 'success' });
    }
   } catch (error) {
        // Handle the error and send an appropriate response
        res.status(500).json({ msg: 'An error occurred'  , type: 'error'});
   }
}

// ***************************** GET ITEM ********************************************


const getItem = async(req ,res) => {
  try {
    let query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }
    const limit  =  req.query.limit ? req.query.limit : 9 ;
    const skip =  req.query.page ? req.query.page*limit - limit : 0 ;

    const totalItem = await sellerItemModel.countDocuments(query);
    const totalPage =  totalItem%limit === 0 ? totalItem /limit  : Math.floor(totalItem / limit) + 1 ;
    let count = 0;
    const items = await sellerItemModel.find(query).skip(skip).limit(limit);
    
    const itemData = items.map((item) => {
      const { _id, productName, category, price, pricePer, description, filename } = item;


      const imagePath = 'D:\\Project\\server\\uploads\\Items\\' + filename;
      const imageData = fs.readFileSync(imagePath).toString('base64');
      count++;
      return {
        _id,
        productName,
        category,
        price,
        pricePer,
        description,
        image: imageData,
      };
    });
  
    res.status(200).json({ totalPage, totalItem, itemsLength:count,items: itemData }); 
  } catch (error) {
    // Handle the error and send an appropriate response
    res.status(500).json({ msg: 'An error occurred' + error  , type: 'error'});
  }
}

// ***************************** ITEM Detail********************************************
const itemDetail = async(req ,res) =>{
  try {
    const item = await sellerItemModel.find({_id:req.query.id});
    // console.log(item);
    const imagePath = 'D:\\Project\\server\\uploads\\Items\\' + item[0].filename;
    const imageData = fs.readFileSync(imagePath).toString('base64');

    const data = {
      productName: item[0].productName,
      category: item[0].category,
      price: item[0].price,
      pricePer: item[0].pricePer,
      description: item[0].description,
      image: imageData,
    };

    res.status(200).json(data); 
  } catch (error) {
    res.status(500).json({ msg: 'An error occurred' + error  , type: 'error'});
  }
}

module.exports = {
  signup,
  login,
  getItem,
  itemDetail,
};