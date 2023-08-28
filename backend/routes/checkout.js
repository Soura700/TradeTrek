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

// Exporting
module.exports = router;
