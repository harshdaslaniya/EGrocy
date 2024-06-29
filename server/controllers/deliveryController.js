const path = require('path');
const multer = require("multer");
const deliveryModel = require("../model/deliveryModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id },process.env.SECRET_KEY, { expiresIn: "1d" });
};




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null,  new Date().toISOString().replace(/:/g, "-") + "=="+"-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");


const signup = async (req, res) => {
    try {
      // upload a file in server
        upload(req, res, async function (err) {
            if (err) {
                console.error("Error uploading image:", err.message);
                return res.status(400).send("Error uploading image: " + err.message);
            }
           
        const {name , password, email , phone} = req.body;
        // verify all data filled
        if (!name || !email || !password || !phone ) {
          return res.status(400).json({ msg: 'Please fill in all required fields', type: 'warning' });
        }
        if (!req.file) {
          console.error("No file uploaded");
          return res.status(400).send({ msg: "No file uploaded", type: 'warning' });
        }

        // verify password are of 6 digit
        if (password.length < 6) {
          return res.status(400).json({ msg: 'Password must be up to 6 characters', type: 'warning' });
        }

        //verify user present in database
        const userExists = await deliveryModel.findOne({ email });
        if (userExists) {
          return res.status(400).json({ msg: 'Email has already been registered', type: 'warning' });
        }


        const user = new deliveryModel({
          name,
          password,
          email,
          phone,
          filename: req.file.filename,
          originalname: req.file.originalname,
          size: req.file.size,
          path: req.file.path,
        });

              // Generate token
        const token = generateToken(user._id);
        res.header('Access-Control-Allow-Credentials', true);
        const newCookieName = `deliverymanToken`;
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
      });
    } catch (err) {
      console.error("Error uploading image:", err.message);
      res.status(500).send({ msg: "Error uploading image", type: 'error' });
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
   const userExists = await deliveryModel.findOne({ email });
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
     const newCookieName = `deliverymanToken`;
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


  const getImage = (req, res) => {
    const { name } = {"name":"h1"};
    console.log(name);
    deliveryModel.findOne({ name })
      .then((image) => {
        if (!image) {
          return res.status(404).json({ message: 'Image not found' });
        }
  
        const imagePath = path.join(__dirname, '..', 'uploads', image.filename);
  
        fs.readFile(imagePath, (err, data) => {
          if (err) {
            return res.status(500).json({ message: 'Error retrieving image', err });
          }
  
          res.setHeader('Content-Type', 'image/jpeg');
          res.send(data);
        });
      })
      .catch((error) => {
        res.status(500).json({ message: 'Error retrieving image', error });
      });
  };
  
  module.exports = { signup , login , getImage };
