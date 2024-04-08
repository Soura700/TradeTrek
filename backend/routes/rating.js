var express = require("express");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");

router.post("/set_ratings", (req, res) => {
    const { user_id, product_id , ratings } = req.body;
  
    // connection.query(
    //   "SELECT * FROM interactions WHERE user_id = ? AND product_id = ?",
    //   [user_id, product_id],
    //   (err, results) => {
    //     if (err) {
    //       console.log("Error checking user visit:", err);
    //       res.status(500).json({ error: "Internal Server Error" });
    //     } else {
        //   if (results.length === 0) {
            // If user has never visited the page, insert a new interaction record
            connection.query(
              "INSERT INTO interactions (user_id, product_id, interaction_type, ratings) VALUES (?, ?, ?, ?)",
              [user_id, product_id, "ratings", ratings],
              (err) => {
                if (err) {
                  console.error("Error inserting user visit:", err);
                  res.status(500).json({ error: "Internal server error" });
                } else {
                  res.status(200).json({ message: "User visit tracked successfully" });
                }
              }
            // );
        //   } 
        // }
    //   }
    );
  })

  router.get("/average_rating/:product_id", (req, res) => {
    const { product_id } = req.params;
  
    connection.query(
      "SELECT AVG(ratings) AS average_rating FROM interactions WHERE product_id = ?",
      [product_id],
      (err, results) => {
        if (err) {
          console.error("Error calculating average rating:", err);
          res.status(500).json({ error: "Internal server error" });
        } else {
          const averageRating = results[0].average_rating;
          res.status(200).json({ averageRating });
        }
      }
    );
  });
  module.exports = router;