const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
 shopName: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    // required: [true, "Please add a password"],
    // minLength: [6, "Password must be up to 6 characters"],
    //   maxLength: [23, "Password must not be more than 23 characters"],
  },
  email: {
    type: String,
    // required: [true, "Please add a email"],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
  phone: {
    type: Number,
    // required: [true, "Please add a Phone No."]
  },
  timing: {
    startHour: { type: Number },
    startMin: { type: Number },
    startSec: { type: Number},
    endHour: { type: Number},
    endMin: { type: Number },
    endSec: { type: Number},
  },
  address: {
    type: String
  },
  token:[{
    token:{
        type: String
    }
}]
},
{
  timestamps: true,
}
);

//   Encrypt password before saving to DB
sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const sellerModel = mongoose.model("sellerModel", sellerSchema);
module.exports = sellerModel;
