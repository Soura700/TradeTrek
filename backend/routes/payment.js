const router = require("express").Router();
const stripe = require("stripe")("sk_test_51NXlH8SCjxVrmpGJqbSL4tInAQBRGpSY0FL26khuSmr01NSFgXYABDHGXwoLsRe6O7MidOz0zqR5G2lYJME3Cszp00aTXsERic")
const connection = require("../connection");


// Endpoint to handle webhook events
router.post('/webhook', async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    // Invalid signature
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Handle successful checkout session
    // Here you can update your database, mark orders as paid, etc.
  }

  res.json({ received: true });
});


// Payment 

router.post("/checkout-session", async (req, res) => {
  const userId = req.body.user_id;

  try {
    // Fetch the cart products for the user from the database

    connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, userResults) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      
      if (userResults.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      connection.query('SELECT * FROM carts WHERE user_id = ?', [userId], (err, cartResults) => {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }

        if (cartResults.length === 0) {
          return res.status(404).json({ message: "Cart not found for this user." });
        }
      

        const cartPromises = cartResults.map((cart)=>{
          return new Promise((resolve)=>{
            connection.query('SELECT c.* , p.productName , p.images FROM carts c RIGHT JOIN products p ON c.product_id = p.p_id WHERE id = ?;',[cart.id],(err,cartProductsResults)=>{
                if(err){
                  console.log(err);
                  return res.status(500).json(err);
                }

                cart.cartProducts = cartProductsResults; // Attach cart products to the cart object
                resolve(cart);
            })
          })
        })

        Promise.all(cartPromises)
        .then(async (cartsWithProducts) => {

          // Print carts with products


          const lineItems = [];
          cartsWithProducts.forEach((cart)=>{
            cart.cartProducts.forEach((item)=>{


              lineItems.push({
                price_data:{
                  currency:"usd",
                  product_data:{
                    name:item.productName,
                    // images:[`http://localhost:5000/${item.images[0]}`]
                  },
                  unit_amount:item.totalPrice * 100,
                },
                quantity:item.cartItemCount,
              })
            })
          })

          // Create a session using Stripe
          // Replace this part with your Stripe session creation code



            // Create a session using Stripe
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              mode: "payment",
              line_items: lineItems,
              success_url: "http://localhost:5000", // Replace with your success URL
              cancel_url: "http://localhost:5000/checkout", // Replace with your cancel URL
            });

            res.json({ url: session.url }); // Replace 'stripe_session_url' with the actual session URL
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json(error);
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


module.exports = router;