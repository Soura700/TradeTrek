var express = require("express");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");

router.post("/set_reviews", (req, res) => {
  const { user_id, product_id, review } = req.body;
  connection.query(
    "INSERT INTO reviews (user_id, product_id, review) VALUES (?, ?, ?)",
    [user_id, product_id, review],
    (err) => {
      if (err) {
        console.error("Error inserting user visit:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(200).json({ message: "User review taken successfully" });
      }
    }
  );
});

router.get("/get_reviews/:product_id", async (req, res) => {
    const { product_id } = req.params;
    connection.query(
      "SELECT reviews.*, products.*, users.* FROM reviews JOIN products ON reviews.product_id = products.p_id JOIN users ON reviews.user_id = users.id WHERE reviews.product_id = ?",
      [product_id],
      (err,result) => {
        if (err) {
          console.error("Error inserting user visit:", err);
          res.status(500).json({ error: "Internal server error" });
        } else {
          res.status(200).json({result});
        }
      }
    );
  });
  

//       "SELECT reviews.*, products.*, users.* FROM reviews JOIN products ON reviews.product_id = products.p_id JOIN users ON reviews.user_id = users.id WHERE reviews.product_id = ?"

module.exports = router;
