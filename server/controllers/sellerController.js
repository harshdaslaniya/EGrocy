const sellerModel = require("../model/sellerModel");
const sellerItemModel = require("../model/sellerItemModel");
const fs = require('fs');
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");




// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id },process.env.SECRET_KEY, { expiresIn: "1d" });
};



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/Items");
  },
  filename: function (req, file, cb) {
    cb(null,  new Date().toISOString().replace(/:/g, "-") + "=="+"-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");



const signup = async (req, res) => {
    try {

        const {name, shopName, password, email, phone, timing, address} = req.body;
        // verify all data filled
        if (!name || !shopName || !email || !password || !phone || !timing || !address) {
          return res.status(400).json({ msg: 'Please fill in all required fields', type: 'warning' });
        }

        // verify password are of 6 digit
        if (password.length < 6) {
          return res.status(400).json({ msg: 'Password must be up to 6 characters', type: 'warning' });
        }

        //verify user present in database
        const userExists = await sellerModel.findOne({ email });
        if (userExists) {
          return res.status(400).json({ msg: 'Email has already been registered', type: 'warning' });
        }


        const user = new sellerModel({
          name,
          shopName,
          password,
          email,
          phone,
          timing,
          address,
        });

              // Generate token
        const token = generateToken(user._id);
        res.header('Access-Control-Allow-Credentials', true);
        const newCookieName = `sellerToken`;
        res.cookie(newCookieName, token, {
          path: "/",
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 86400), // 1 day
          sameSite: "none",
          secure: true,
        });
        // Save token to user
        user.token.push({ token });
  
        try {
          await user.save();
          res.send({msg:"Data stored successfully",type:"success"});
        } catch (err) {
          console.error("Error storing file data:", err.message);
          res.status(500).send({ msg: "Error storing file data", type: 'error' });
        }
      }
     catch (err) {
      console.error("Error here", err.message);
      res.status(500).send({ msg: "Error here", type: 'error' });
    }
}
  
// ***************************** login ********************************************

const login = async(req , res ) => {
  try {
    console.log(req.body);
   const{email , password} = req.body;
   // verify all field or Not
   if (!email || !password ) {
     return res.status(400).json({ msg: 'Please fill in all required fields', type: 'warning' });
   }
   // verify user signup or Not
   const userExists = await sellerModel.findOne({ email });
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
     const newCookieName = `sellerToken`;
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
       res.status(500).json({ msg: 'An error occurred' + error  , type: 'error'});
  }
}
   
// ***************************** ADD ITEM ********************************************

const addItem = async(req ,res) => {
  try {

    upload(req, res, async function (err) {
        if (err) {
            console.error("Error uploading image:", err.message);
            return res.status(400).send("Error uploading image: " + err.message);
        }
        
        const { productName , category, price , pricePer , description} = req.body;
        // verify all data filled
        if (!productName || !category || !price || !pricePer || !description) {
          return res.status(400).json({ msg: 'Please fill in all required fields', type: 'warning' });
        }
        if (!req.file) {
          console.error("No file uploaded");
          return res.status(400).send({ msg: "No file uploaded", type: 'warning' });
        }
        const Item = new sellerItemModel({
          sellerId:req.user.id,
          productName ,
          category,
          price , 
          pricePer , 
          description,
          filename: req.file.filename,
          originalname: req.file.originalname,
          size: req.file.size,
          path: req.file.path,
        });

        try {
          await Item.save();
          res.status(200).send({msg:"Data stored successfully",type:"success"});
        } catch (err) {
          console.error("Error storing file data:", err.message);
          res.status(500).send({ msg: "Error storing file data", type: 'error' });
        }


      });
  } catch (error) {
    // Handle the error and send an appropriate response
    res.status(500).json({ msg: 'An error occurred' + error  , type: 'error'});
  }
}

// ***************************** USER INFO ********************************************

const userInfo = async(req ,res) => {
  try {
    const { _id, __v,token, createdAt, updatedAt, ...userData } = req.user._doc;
    res.status(200).json(userData);

  } catch (error) {
    // Handle the error and send an appropriate response
    res.status(500).json({ msg: 'An error occurred' + error  , type: 'error'});
  }
}
   
// ***************************** GET ITEM ********************************************


const getItem = async(req ,res) => {
  try {
    let query = { sellerId:req.user._id };
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

  module.exports = { signup , login , addItem , userInfo , getItem ,itemDetail};
