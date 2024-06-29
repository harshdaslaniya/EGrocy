const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const costumerRoutes = require('./routes/customerRoute');
const deliveryRoutes = require('./routes/deliveryRoutes');
const sellerRoute = require('./routes/sellerRoute')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const port =process.env.PORT || 8000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware to enable CORS
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
// Middleware to parse JSON data
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/customer', costumerRoutes);
app.use('/delivery', deliveryRoutes);
app.use('/seller', sellerRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);   
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  });
// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});