var express = require("express");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");

router.get("/getDetails/:user_id", (req, res) => {
    const user_id = req.params.user_id;
  try {
    connection.query(
        "SELECT p.productName , p.p_id , sum(c.cartItemCount) as totalCount , c.id as cart_id , SUM(c.totalPrice) AS total from products p JOIN (SELECT * from carts where user_id = ? ) c ON c.product_id = p.p_id GROUP BY p.productName , p.p_id , c.id;" 
        ,
      [user_id],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        } else {
          res.status(200).json(result);
        }
      }
    );
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});



router.post('/checkout_order_details', (req, res) => {
  const { userId, country, address, landmark, townCity, state, zip } = req.body;
  console.log("Hello World");

  const insertQuery = 'INSERT INTO OrderDetails (UserID, Country, Address, Landmark, TownCity, State, Zip) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [userId, country, address, landmark, townCity, state, zip];

  connection.query(insertQuery, values, (error, results) => {
    if (error) {
      console.log(error);
      console.error('Error inserting order details:', error);
      res.status(500).json({ error: 'An error occurred while inserting order details' });
    } else {
      console.log('Order details inserted successfully');
      res.status(200).json({ message: 'Order details inserted successfully' });
    }
  });
});

// Exporting
module.exports = router;
