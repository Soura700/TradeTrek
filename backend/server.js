const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
var connection = require("./connection")
var createProduct = require("./routes/products");
var registerAuth = require("./routes/registerAuth")
var cartRoute = require("./routes/cart")
var checkoutRoute = require("./routes/checkout")
var orderRoute = require("./routes/order");
const payment = require("./routes/payment")
const server = require("http").Server(app)
const cors = require("cors");
const sendMail = require("./controllers/sendMail");
const interactionRoute = require("./routes/interaction");
const rating = require("./routes/rating");
const axios = require( 'axios' );




// Step 1:
dotenv.config();

// Step 2:
app.use(express.json());

app.use("/upload",express.static("upload"));

// Step 3:
// const connection = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE
//   });

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//   },
// }).listen(5500);

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
  credentials: true,
}))

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ', err);
      return;
    }
  
    console.log('Connected to the database');
  });


// app.use(express.static("public"));

// Step 4:
// app.set('view engine', 'ejs');

PORT=5000;


// route for the template engine
// app.get("/",(req,res)=>{
//     res.render('text');
// })

// io.on("connection",(socket)=>{
//   socket.on("")
// })

app.get("/",(req,res)=>{
  res.send("Hello")
})

// app.get("/api/recommendations", async (req, res) => {
//   try {
//       const { user_id } = req.query; // Get user_id from query parameters
//       const pythonAPIUrl = "http://localhost:5000/recommendations"; // URL of the Python recommendation API

//       // Make an HTTP GET request to the Python API
//       const response = await axios.post(pythonAPIUrl, { params: { user_id } });

//       // Extract recommendations from the response
//       const recommendations = response.data.recommendations;

//       // Send recommendations to the client
//       res.json({ recommendations });
//   } catch (error) {
//       console.error("Error fetching recommendations:", error.message);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post('/api/recommendations', async (req, res) => {
  try {
      // Extract the user ID from the request parameters
      const user_id = req.body.user_id;

      console.log(typeof user_id);

      // Make a POST request to the Flask API to fetch recommendations
      const response = await axios.post('http://localhost:5000/recommendations', {
          user_id: user_id
      });

      // Extract recommendations from the response
      const recommendations = response.data;

      // Send recommendations as a JSON response
      res.json({ user_id: user_id, recommendations: recommendations });
  } catch (error) {
    console.log(error);
      // If an error occurs, send an error response
      console.error('Error fetching recommendations:', error.message);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.use("/api/auth",registerAuth);

app.use("/api/product",createProduct);

app.use("/api/cart",cartRoute);

app.use("/api/checkout",checkoutRoute);

app.use("/api/order",orderRoute)

app.use("/api",payment)

app.use("/sendMail",sendMail);

app.use("/api/interaction" ,interactionRoute);

app.get("/sendMail",sendMail);

app.use("/api/rating" , rating);




// Step 5:
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));