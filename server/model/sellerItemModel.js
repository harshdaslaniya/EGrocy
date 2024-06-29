const mongoose = require("mongoose");


const sellerItemSchema = new mongoose.Schema({
  sellerId:{
    type : String,
  },
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
  },
  price: {
      type: Number,
      required: [true, "Please add a Price"],
    },
  pricePer: {
      type: String,
      required: [true, "Please add a pricePer"],
  },
  description: {
      type: String,
      required: [true, "Please add a description"],
  },
  filename: {
    type: String,
    required: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  
},
{
  timestamps: true,
}
);



const sellerItemModel = mongoose.model("sellerItem", sellerItemSchema);
module.exports = sellerItemModel;
