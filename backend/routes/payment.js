const router = require("express").Router();
const stripe = require("stripe")(
  "sk_test_51NXlH8SCjxVrmpGJqbSL4tInAQBRGpSY0FL26khuSmr01NSFgXYABDHGXwoLsRe6O7MidOz0zqR5G2lYJME3Cszp00aTXsERic"
);
const connection = require("../connection");
const io = require("../socket");

// Endpoint to handle webhook events
router.post("/webhook", async (req, res) => {
  const payload = req.body;
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    // Invalid signature
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // Handle successful checkout session
    // Here you can update your database, mark orders as paid, etc.
  }

  res.json({ received: true });
});

// Payment

// router.post("/checkout-session", async (req, res) => {
//   const userId = req.body.user_id;
//   const {
//     paymentWay,
//     discount,
//     priceAfterDiscount,
//     totalPrice,
//     orderItems,
//     OrderDetailsID
//   } = req.body;

//   console.log(totalPrice +  ' ' + OrderDetailsID);

//   try {
//     // Fetch the cart products for the user from the database

//     connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, userResults) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).json(err);
//       }

//       if (userResults.length === 0) {
//         return res.status(404).json({ message: "User not found." });
//       }

//       connection.query('SELECT * FROM carts WHERE user_id = ? AND is_active = 1', [userId], (err, cartResults) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).json(err);
//         }

//         if (cartResults.length === 0) {
//           return res.status(404).json({ message: "Cart not found for this user." });
//         }

//         const cartPromises = cartResults.map((cart)=>{
//           return new Promise((resolve)=>{
//             connection.query('SELECT c.* , p.productName , p.images FROM carts c RIGHT JOIN products p ON c.product_id = p.p_id WHERE id = ?;',[cart.id],(err,cartProductsResults)=>{
//                 if(err){
//                   console.log(err);
//                   return res.status(500).json(err);
//                 }

//                 cart.cartProducts = cartProductsResults; // Attach cart products to the cart object
//                 resolve(cart);
//             })
//           })
//         })

//         Promise.all(cartPromises)
//         .then(async (cartsWithProducts) => {
//           // Print carts with products
//           const lineItems = [];
//           cartsWithProducts.forEach((cart)=>{
//             console.log(cart);
//             cart.cartProducts.forEach((item)=>{

//               lineItems.push({
//                 price_data:{
//                   currency:"usd",
//                   product_data:{
//                     name:item.productName,
//                     // images:[`http://localhost:5000/${item.images[0]}`]
//                   },
//                   unit_amount:item.price * 100,
//                 },
//                 quantity:item.cartItemCount,
//               })
//             })
//           })
//           // Create a session using Stripe
//           // Replace this part with your Stripe session creation code
//             // Create a session using Stripe
//             // const session = await stripe.checkout.sessions.create({
//             //   payment_method_types: ["card"],
//             //   mode: "payment",
//             //   line_items: lineItems,
//             //   success_url: "http://localhost:3000", // Replace with your success URL
//             //   cancel_url: "http://localhost:5000/checkout", // Replace with your cancel URL
//             //   // shipping_address_collection: {
//             //   //   allowed_countries: ["US", "UK", "Canada"] // Add countries outside India
//             //   // }
//             // });
//             // res.json({ url: session.url }); // Replace 'stripe_session_url' with the actual session URL

//             stripe.checkout.sessions.create({
//               payment_method_types: ["card"],
//               mode: "payment",
//               line_items: lineItems,
//               success_url: "http://localhost:5000", // Replace with your success URL
//               cancel_url: "http://localhost:5000/checkout", // Replace with your cancel URL

//             }).then(session => {
//               // Execute SQL query after successful payment
//               const updateQuery = 'UPDATE carts SET is_active = 0 WHERE user_id = ? AND is_active = 1';
//               const orderInsertQuery = 'INSERT INTO orders (user_id, paymentWay, discount, priceAfterDiscount, totalPrice, order_date, OrderDetailsID) VALUES (?, Card, ?, ?, ?, NOW(), ?)'
//               const orderValues = [
//                 userId,
//                 discount,
//                 priceAfterDiscount,
//                 ,
//                 OrderDetailsID
//               ];
//               connection.query(updateQuery, orderValues, (updateErr, updateResult) => {
//                 if (updateErr) {
//                   console.error("Error updating user's last payment date:", updateErr);
//                   return res.status(500).json({ error: "An error occurred while updating user's last payment date" });
//                 }
//                 // Handle success response
//                 res.json({ url: session.url });
//               });

//               connection.query(orderInsertQuery, [userId], (updateErr, updateResult) => {
//                 if (updateErr) {
//                   console.error("Error updating user's last payment date:", updateErr);
//                   return res.status(500).json({ error: "An error occurred while updating user's last payment date" });
//                 }
//                 // Handle success response
//                 res.json({ url: session.url });
//               });

//             }).catch(error => {
//               console.error("Error creating Stripe session:", error);
//               res.status(500).json({ error: "An error occurred while creating the Stripe session" });
//             });

//             // connection.query(updateQuery, [userId], (updateErr, updateResult) => {
//             //   if (updateErr) {
//             //     console.error("Error updating user's last payment date:", updateErr);
//             //     // Handle error response
//             //     return res.status(500).json({ error: "An error occurred while updating user's last payment date" });
//             //   }
//             //   // Handle success response
//             //   res.json({ url: session.url }); // Replace 'stripe_session_url' with the actual session URL
//             // });
//         })
//         .catch((error) => {
//           console.log(error);
//           res.status(500).json(error);
//         });
//       });
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// });

router.post("/checkout-session", async (req, res) => {
  const userId = req.body.user_id;
  const {
    paymentWay,
    discount,
    priceAfterDiscount,
    totalPrice,
    orderItems,
    OrderDetailsID,
  } = req.body;

  console.log(totalPrice + " " + OrderDetailsID);

  try {
    // Fetch the cart products for the user from the database

    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [userId],
      (err, userResults) => {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }

        if (userResults.length === 0) {
          return res.status(404).json({ message: "User not found." });
        }

        connection.query(
          "SELECT * FROM carts WHERE user_id = ? AND is_active = 1",
          [userId],
          (err, cartResults) => {
            if (err) {
              console.log(err);
              return res.status(500).json(err);
            }

            if (cartResults.length === 0) {
              return res
                .status(404)
                .json({ message: "Cart not found for this user." });
            }

            const cartPromises = cartResults.map((cart) => {
              return new Promise((resolve) => {
                connection.query(
                  "SELECT c.* , p.productName , p.images FROM carts c RIGHT JOIN products p ON c.product_id = p.p_id WHERE id = ?;",
                  [cart.id],
                  (err, cartProductsResults) => {
                    if (err) {
                      console.log(err);
                      return res.status(500).json(err);
                    }

                    cart.cartProducts = cartProductsResults; // Attach cart products to the cart object
                    resolve(cart);
                  }
                );
              });
            });

            Promise.all(cartPromises)
              .then(async (cartsWithProducts) => {
                // Print carts with products
                const lineItems = [];
                cartsWithProducts.forEach((cart) => {
                  console.log(cart);
                  cart.cartProducts.forEach((item) => {
                    lineItems.push({
                      price_data: {
                        currency: "usd",
                        product_data: {
                          name: item.productName,
                          // images:[`http://localhost:5000/${item.images[0]}`]
                        },
                        unit_amount: item.price * 100,
                      },
                      quantity: item.cartItemCount,
                    });
                  });
                });
                // Create a session using Stripe
                // Replace this part with your Stripe session creation code
                // Create a session using Stripe
                // const session = await stripe.checkout.sessions.create({
                //   payment_method_types: ["card"],
                //   mode: "payment",
                //   line_items: lineItems,
                //   success_url: "http://localhost:3000", // Replace with your success URL
                //   cancel_url: "http://localhost:5000/checkout", // Replace with your cancel URL
                //   // shipping_address_collection: {
                //   //   allowed_countries: ["US", "UK", "Canada"] // Add countries outside India
                //   // }
                // });
                // res.json({ url: session.url }); // Replace 'stripe_session_url' with the actual session URL

                stripe.checkout.sessions
                  .create({
                    payment_method_types: ["card"],
                    mode: "payment",
                    line_items: lineItems,
                    success_url: "http://localhost:5000", // Replace with your success URL
                    cancel_url: "http://localhost:5000/checkout", // Replace with your cancel URL
                  })
                  .then((session) => {
                    // Execute SQL query after successful payment
                    const updateQuery =
                      "UPDATE carts SET is_active = 0 WHERE user_id = ? AND is_active = 1";
                    const orderInsertQuery =
                      'INSERT INTO orders (user_id, paymentWay, discount, priceAfterDiscount, totalPrice, order_date, OrderDetailsID) VALUES (?, "Card", ?, ?, ?, NOW(), ?)';
                    const orderValues = [
                      userId,
                      discount,
                      priceAfterDiscount,
                      totalPrice,
                      OrderDetailsID,
                    ];
                    connection.query(
                      updateQuery,
                      [userId],
                      (updateErr, updateResult) => {
                        if (updateErr) {
                          console.error(
                            "Error updating user's last payment date:",
                            updateErr
                          );
                          return res
                            .status(500)
                            .json({
                              error:
                                "An error occurred while updating user's last payment date",
                            });
                        }
                        // Handle success response
                        res.json({ url: session.url });
                      }
                    );

                    connection.query(
                      orderInsertQuery,
                      orderValues,
                      (insertErr, insertResult) => {
                        if (insertErr) {
                          console.error(
                            "Error inserting order data:",
                            insertErr
                          );
                          return res
                            .status(500)
                            .json({
                              error:
                                "An error occurred while inserting order data",
                            });
                        }
                        // Handle success response
                        console.log("Order data inserted successfully");
                        const orderId = insertResult.insertId;
                        orderItems.forEach((item) => {
                          const { product_id, cart_id, quantity, price } = item;

                          const orderItemQuery = `
                    INSERT INTO order_items (order_id, product_id, cart_id, quantity, price)
                    VALUES (?, ?, ?, ?, ?)
                  `;
                          const orderItemValues = [
                            orderId,
                            product_id,
                            cart_id,
                            quantity,
                            price,
                          ];

                          connection.query(
                            orderItemQuery,
                            orderItemValues,
                            (itemError) => {
                              if (itemError) {
                                console.error(
                                  "Error inserting order item:",
                                  itemError
                                );
                              }
                            }
                          );

                          // Emit socket event here
                          connection.query(
                            "SELECT * FROM users WHERE id = ?",
                            [userId],
                            (userError, userResult) => {
                              if (userError) {
                                console.error(
                                  "Error fetching user:",
                                  userError
                                );
                                return;
                              }

                              connection.query(
                                "SELECT * FROM products WHERE p_id = ?",
                                [product_id],
                                (productError, productResult) => {
                                  if (productError) {
                                    console.error(
                                      "Error fetching product:",
                                      productError
                                    );
                                    return;
                                  }

                                  const orderDetailsQuery =
                                    "SELECT * FROM OrderDetails WHERE OrderDetailsID = ?";
                                  connection.query(
                                    orderDetailsQuery,
                                    [OrderDetailsID],
                                    (orderDetailsError, orderDetailsResult) => {
                                      if (orderDetailsError) {
                                        console.error(
                                          "Error fetching order details:",
                                          orderDetailsError
                                        );
                                        res
                                          .status(500)
                                          .json({
                                            error:
                                              "An error occurred while fetching order details",
                                          });
                                        return;
                                      }
                                      const orderDetails =
                                        orderDetailsResult[0]; // Assuming there's only one order detail for the given OrderDetailsID
                                      // Emit socket event
                                      io.emit("create_order", {
                                        user_id: userId,
                                        order_item_ids: orderId,
                                        order_ids: orderId,
                                        product_ids: product_id,
                                        user_names: userResult[0].fullname,
                                        product_names:productResult[0].productName,
                                        order_details: orderDetails // Include order details in the socket event data
                                      });
                                    }
                                  );
                                }
                              );
                            }
                          );
                        });
                      }
                    );
                  })
                  .catch((error) => {
                    console.error("Error creating Stripe session:", error);
                    res
                      .status(500)
                      .json({
                        error:
                          "An error occurred while creating the Stripe session",
                      });
                  });
              })
              .catch((error) => {
                console.log(error);
                res.status(500).json(error);
              });
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
