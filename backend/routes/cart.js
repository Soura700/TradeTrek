var express = require("express");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection");
const io = require("../socket")


// router.post("/add-to-cart", (req, res) => {
//   const user_id = req.body.user_id;
//   const product_id = req.body.product_id;
//   const cartItemCount = req.body.cartItemCount;
//   const totalPrice = req.body.totalPrice;

//   const newCart = {
//     user_id: user_id,
//     product_id: product_id,
//     cartItemCount: cartItemCount,
//     totalPrice: totalPrice,
//     is_active: 1 // Set the new cart to active
//   };

//   try {
//     connection.query(
//       "SELECT * FROM carts WHERE user_id = ? AND product_id = ?",
//       [user_id, product_id],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).json(err);
//         }

//         if (result.length > 0) {
//           const existingCart = result[0];
//           const existingCartItemCount = existingCart.cartItemCount;

//           if (existingCart.is_active === 0) {
//             // Create a new cart since the existing one is inactive
//             connection.query(
//               "INSERT INTO carts SET ?",
//               newCart,
//               (insertErr, insertResult) => {
//                 if (insertErr) {
//                   console.log(insertErr);
//                   return res.status(500).json(insertErr);
//                 }
//                 res.status(200).json(insertResult);
//               }
//             );
//           } else {
//             // Update the existing cart
//             const updatedCartItemCount = existingCartItemCount + cartItemCount;
//             connection.query(
//               "UPDATE carts SET cartItemCount = ? WHERE user_id = ? AND product_id = ?",
//               [updatedCartItemCount, user_id, product_id],
//               (updateErr, updateResult) => {
//                 if (updateErr) {
//                   console.log(updateErr);
//                   return res.status(500).json(updateErr);
//                 }              
//                 io.emit('create_cart' , {product_id:product_id , cartItemCount:cartItemCount , user_id : user_id})
//                 res.status(200).json(updateResult);
//               }
//             );
//           }
//         } else {
//           // No existing cart found, create a new one
//           connection.query(
//             "INSERT INTO carts SET ?",
//             newCart,
//             (insertErr, insertResult) => {
//               if (insertErr) {
//                 console.log(insertErr);
//                 return res.status(500).json(insertErr);
//               }
//               io.emit('create_cart' , {product_id:product_id , cartItemCount:cartItemCount , user_id : user_id})
//               res.status(200).json(insertResult);
//             }
//           );
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// });


// router.post("/add-to-cart", (req, res) => {
//   const user_id = req.body.user_id;
//   const product_id = req.body.product_id;
//   const cartItemCount = req.body.cartItemCount;
//   const totalPrice = req.body.totalPrice;
//   const newCart = {
//     user_id: user_id,
//     product_id: product_id,
//     cartItemCount: cartItemCount,
//     totalPrice: totalPrice,
//     is_active: 1 // Set the new cart to active
//   };

//   try {
//     connection.query(
//       "SELECT * FROM carts WHERE user_id = ? AND product_id = ?",
//       [user_id, product_id],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).json(err);
//         }

//         if (result.length > 0) {
//           console.log("Existing Cart");
//           console.log(result[0]);
//           const existingCart = result[0];
//           const existingCartItemCount = existingCart.cartItemCount;

//           if (existingCart.is_active === 0) {
//             // Create a new cart since the existing one is inactive
//             connection.query(
//               "INSERT INTO carts SET ?",
//               newCart,
//               (insertErr, insertResult) => {
//                 if (insertErr) {
//                   console.log(insertErr);
//                   return res.status(500).json(insertErr);
//                 }
//                 res.status(200).json(insertResult);
//               }
//             );
//           } else {
//             // Update the existing cart
//             const updatedCartItemCount = existingCartItemCount + cartItemCount;
//             connection.query(
//               "UPDATE carts SET cartItemCount = ? WHERE user_id = ? AND product_id = ?",
//               [updatedCartItemCount, user_id, product_id],
//               (updateErr, updateResult) => {
//                 if (updateErr) {
//                   console.log(updateErr);
//                   return res.status(500).json(updateErr);
//                 }              
//                 io.emit('create_cart' , {product_id:product_id , cartItemCount:cartItemCount , user_id : user_id , total_Price: totalPrice})
//                 res.status(200).json(updateResult);
//               }
//             );
//           }
//         } else {
//           // No existing cart found, create a new one
//           connection.query(
//             "INSERT INTO carts SET ?",
//             newCart,
//             (insertErr, insertResult) => {
//               if (insertErr) {
//                 console.log(insertErr);
//                 return res.status(500).json(insertErr);
//               }
//               console.log(insertResult)
//               io.emit('create_cart' , {product_id:product_id , cartItemCount:cartItemCount , user_id : user_id , total_Price: totalPrice})
//               res.status(200).json(insertResult);
//             }
//           );
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// });


router.post("/add-to-cart", (req, res) => {
  const user_id = req.body.user_id;
  const product_id = req.body.product_id;
  const cartItemCount = req.body.cartItemCount;
  const totalPrice = req.body.totalPrice;
  const newCart = {
    user_id: user_id,
    product_id: product_id,
    cartItemCount: cartItemCount,
    totalPrice: totalPrice,
    price:totalPrice/cartItemCount,
    is_active: 1 // Set the new cart to active
  };

  try {
    connection.query(
      "SELECT * FROM carts WHERE user_id = ? AND product_id = ? AND is_active = 1",
      [user_id, product_id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }

        if (result.length > 0) {
          console.log("Existing Active Cart");
          console.log(result[0]);
          const existingCart = result[0];
          const existingCartItemCount = existingCart.cartItemCount;
          const existingTotalPrice = existingCart.totalPrice;

          // Update the existing cart
          const updatedCartItemCount = existingCartItemCount + cartItemCount;
          const updatedTotalPrice = parseFloat(existingTotalPrice) + totalPrice; // convert ex
          connection.query(
            "UPDATE carts SET cartItemCount = ?, totalPrice = ? WHERE user_id = ? AND product_id = ?",
            [updatedCartItemCount, updatedTotalPrice, user_id, product_id],
            (updateErr, updateResult) => {
              if (updateErr) {
                console.log(updateErr);
                return res.status(500).json(updateErr);
              }
              io.emit('update_cart' , {product_id:product_id , cartItemCount:cartItemCount , user_id : user_id , total_Price: totalPrice})
              res.status(200).json(updateResult);
            }
          );
        } else {
          // No existing active cart found, create a new one
          connection.query(
            "INSERT INTO carts SET ?",
            newCart,
            (insertErr, insertResult) => {
              if (insertErr) {
                console.log(insertErr);
                return res.status(500).json(insertErr);
              }
              console.log(insertResult)
              io.emit('create_cart' , {product_id:product_id , cartItemCount:cartItemCount , user_id : user_id , total_Price: totalPrice})
              res.status(200).json(insertResult);
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});



router.get("/get/cart/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  try {
    connection.query(
      `SELECT p_id, productName, is_active, totalPrice, c.price, images, SUM(cartItemCount) AS total
      FROM products p 
      JOIN carts c ON c.product_id = p.p_id  
      WHERE c.user_id = ?
      GROUP BY p.p_id, p.productName, c.is_active, c.totalPrice, c.price, p.images;`,
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
    res.status(500).json(error);
  }
});


//  Here this is for updating the cart...It will chekc firsrt if the cart exists (first query) then  it will fetch the product id (second query) then i have stored the difference between updated cartItemCount
// and current (difference = quantity - existingCartItemCount)...Then if it is in negative then the price of these product will be also negatinve (difference * price )...then i have updated the existing quantity
// with new quantity...and i have added the new product price to the exisitng price.. (if it is negative (when the quantity will be small thann the existing) then it will be deducted... and if it is positive
//then price will be added to the existing price(when the new quantity is bigger than the existing))


// Update Cart
router.put("/update_cart/:user_id", (req, res) => {

  const user_id = req.params.user_id;
  const product_id = req.body.product_id;
  const quantity = req.body.quantity;
  const is_active = req.body.is_active;

  try {
    connection.query(

      //Finding the cart by user 

      "SELECT * FROM carts WHERE user_id = ? AND product_id = ?",
      [user_id, product_id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }

        if (result.length > 0) {
          const existingCartItemCount = result[0].cartItemCount;
          // const updatedCartItemCount = existingCartItemCount + quantity;
          const updatedCartItemCount = quantity;
          const existingCartPrice = result[0].totalPrice;
          const difference = quantity - existingCartItemCount;

          // Fetch the product price from the products table based on product_id

          connection.query(
            "SELECT price FROM products WHERE p_id = ?",
            [product_id],
            (priceErr, priceResult) => {
              if (priceErr) {
                console.log(priceErr);
                return res.status(500).json(priceErr);
              }

              if (priceResult.length > 0) {
                const productPrice = priceResult[0].price;
                const updatedCartPrice = difference * productPrice;

                const existingPrice = parseInt(existingCartPrice);

                const finalPrice = existingPrice + updatedCartPrice;

                // Update cartItemCount and price in the carts table
                connection.query(
                  "UPDATE carts SET cartItemCount = ?, totalPrice = ? WHERE user_id = ? AND product_id = ?",
                  [updatedCartItemCount, finalPrice, user_id, product_id],
                  (updateErr, updateResult) => {
                    if (updateErr) {
                      console.log(updateErr);
                      return res.status(500).json(updateErr);
                    }
                    res.status(200).json(updateResult);
                    console.log("user_id:" + user_id + " " + "product_id :" +  product_id + " " +  "finalPrice :" +  finalPrice + " " + "updatedCartItemCount :"+ updatedCartItemCount)
                    io.emit("update_cart" , {user_id:user_id , product_id : product_id , finalPrice : finalPrice ,  updatedCartItemCount : updatedCartItemCount})
                  }
                );
              } else {
                res.status(404).json({ message: "Product not found" });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/update_status/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  const cart_id = req.body.cart_id;
  const is_active = req.body.is_active;

  try {
    connection.query(
      "UPDATE carts SET is_active = ? WHERE user_id = ? AND id = ?",
      [is_active,user_id, cart_id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        } else {
          return res.status(200).json({ message: "Updated Successfully" });
        }
      }
    );
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});

router.delete("/delete_cart/:user_id" , async (req,res)=>{
  const user_id = req.params.user_id; 
  try {
    connection.query("DELETE carts WHERE user_id = ?" , [user_id] , (err , result)=>{
      if(err){
        console.log(err);
        return res.status(500).json(err);
      }else{
        return  res.status(204).json({message:"Cart deleted successfullly"});
      }
    })
  }catch(error){
    console.log(error)
    return res.status(500).json(error)
  }
})



// Exporting
module.exports = router;
