var express = require("express");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");

router.post("/logUserView", (req, res) => {
  const { user_id, product_id } = req.body;

  connection.query(
    "SELECT * FROM interactions WHERE user_id = ? AND product_id = ?",
    [user_id, product_id],
    (err, results) => {
      if (err) {
        console.log("Error checking user visit:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length === 0) {
          // If user has never visited the page, insert a new interaction record
          connection.query(
            "INSERT INTO interactions (user_id, product_id, interaction_type, count_view) VALUES (?, ?, ?, ?)",
            [user_id, product_id, "visit", 1],
            (err) => {
              if (err) {
                console.error("Error inserting user visit:", err);
                res.status(500).json({ error: "Internal server error" });
              } else {
                res.status(200).json({ message: "User visit tracked successfully" });
              }
            }
          );
        } else {
          // If user has previously visited the page, update count_view
          const countView = results[0].count_view + 1;
          connection.query(
            "UPDATE interactions SET count_view = ? WHERE user_id = ? AND product_id = ?",
            [countView, user_id, product_id],
            (err) => {
              if (err) {
                console.error("Error updating user visit count:", err);
                res.status(500).json({ error: "Internal server error" });
              } else {
                res.status(200).json({ message: "User visit tracked successfully" });
              }
            }
          );
        }
      }
    }
  );
})

module.exports = router;
