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

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const sqlQuery = " SELECT * FROM users WHERE lastLoginTime >= ? ORDER BY lastLoginTime DESC";

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

router.post("/create-order", async (req, res) => {
  try {
    const {
      user_id,
      paymentWay,
      discount,
      priceAfterDiscount,
      totalPrice,
      orderItems,
    } = req.body;

    // Fetch users whose lastLoginTime is within the last 1 month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Perform SQL query to retrieve users
    const sqlQuery = `
      SELECT *
      FROM users
      WHERE lastLoginTime >= ?
      ORDER BY lastLoginTime DESC
    `;

    connection.query(sqlQuery, [oneMonthAgo], async (sqlError, sqlResults) => {
      if (sqlError) {
        console.error("SQL Error:", sqlError);
        res
          .status(500)
          .json({ error: "An error occurred while fetching users" });
        return;
      }

      const usersWithinLastMonth = sqlResults;

      // Sort users by year, month, and date of lastLoginTime
      usersWithinLastMonth.sort((userA, userB) => {
        const dateA = new Date(userA.lastLoginTime);
        const dateB = new Date(userB.lastLoginTime);

        // Compare years
        if (dateA.getFullYear() !== dateB.getFullYear()) {
          return dateB.getFullYear() - dateA.getFullYear();
        }

        // Compare months
        if (dateA.getMonth() !== dateB.getMonth()) {
          return dateB.getMonth() - dateA.getMonth();
        }

        // Compare dates
        // return dateB.getDate() - dateA.getDate();

        // Compare dates
        if (dateA.getDate() !== dateB.getDate()) {
          return dateB.getDate() - dateA.getDate();
        }

        // Compare hours
        if (dateA.getHours() !== dateB.getHours()) {
          return dateB.getHours() - dateA.getHours();
        }

        // Compare minutes
        if (dateA.getMinutes() !== dateB.getMinutes()) {
          return dateB.getMinutes() - dateA.getMinutes();
        }
      });

      // Select the user with the most recent lastLoginTime (first user in the sorted list)
      const userToOrder = usersWithinLastMonth[0];

      // Now, you can create the order using the selected user

      // Insert order data into 'orders' table
      const orderQuery = `
        INSERT INTO orders (user_id, paymentWay, discount, priceAfterDiscount, totalPrice, order_date)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
      const orderValues = [
        user_id, // Assuming id is the user's unique identifier
        paymentWay,
        discount,
        priceAfterDiscount,
        totalPrice,
      ];

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

          connection.query(orderItemQuery, orderItemValues, (itemError) => {
            if (itemError) {
              console.error("Error inserting order item:", itemError);
            }
          });
        });

        res.status(201).json({ message: "Order created successfully" });
      });
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the order" });
  }
});




// Get data by the user_id

router.get("/get_order/:user_id", async (req, res) => {
  try {
    const {user_id} = req.body;
    // Perform SQL query to retrieve users
    const sqlQuery = `
    SELECT *
    FROM order_items
    JOIN orders ON order_items.order_item_id = orders.order_id
    JOIN products ON order_items.product_id = products.p_id
    WHERE orders.user_id = ?`;

    connection.query(sqlQuery, [user_id], async (sqlError, sqlResults) => {
      if (sqlError) {
        console.error("SQL Error:", sqlError);
        res
          .status(500)
          .json({ error: "An error occurred while fetching users" });
        return;
      }else{
        res.status(200).json(sqlResults)
      }
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the order" });
  }
});

module.exports = router;
