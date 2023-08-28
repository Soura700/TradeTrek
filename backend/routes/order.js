const router = require("express").Router();
const connection = require("../connection");



router.post("/create-order", async (req, res) => {
  console.log("Done");
  try {
    const {
      user_id,
      paymentWay,
      discount,
      priceAfterDiscount,
      totalPrice,
      orderItems,
    } = req.body;

    // Insert order data into 'orders' table
    const orderQuery = `
      INSERT INTO orders (user_id, paymentWay, discount, priceAfterDiscount, totalPrice, order_date)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const orderValues = [
      user_id,
      paymentWay,
      discount,
      priceAfterDiscount,
      totalPrice,
    ];
    console.log(user_id);

    connection.query(orderQuery, orderValues, (orderError, orderResult) => {
      if (orderError) {
        console.error("Error creating order:", orderError);
        res
          .status(500)
          .json({ error: "An error occurred while creating the order" });
        return;
      }

      const orderId = orderResult.insertId;

      // Insert order items into 'order_items' table

      console.log("Order Items" + orderItems);


      orderItems.forEach((item) => {
        const { product_id, cart_id, quantity, price } = item;

        const orderItemQuery = `
        INSERT INTO order_items (order_id, product_id, cart_id, quantity, price)
        VALUES (?, ?, ?, ?, ?)
      `;
        const orderItemValues = [orderId, product_id, cart_id, quantity, price];

        connection.query(orderItemQuery, orderItemValues, (itemError) => {
          if (itemError) {
            console.error("Error inserting order item:", itemError);
          }
        });
      });

      res.status(201).json({ message: "Order created successfully" });
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "An error occurred while creating the order" });
  }
});

module.exports = router;
