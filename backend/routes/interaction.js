var express = require("express");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");


app.post('/api/logUserView', (req, res) => {
    const { userId, productId, productName } = req.body;
  
    // Save the data to your database or any storage mechanism
    // Example: Assuming you have a MongoDB setup
    // Save the userId, productId, and productName to your database collection
  
    // Send a success response
    res.status(200).json({ message: 'User view logged successfully.' });
  });


module.exports = router;
