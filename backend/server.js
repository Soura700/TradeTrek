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
const cors = require("cors");




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

app.get("/",(req,res)=>{
  res.send("Hello")
})

app.use("/api/auth",registerAuth);

app.use("/api/product",createProduct);

app.use("/api/cart",cartRoute);

app.use("/api/checkout",checkoutRoute);

app.use("/api/order",orderRoute)

app.use("/api",payment)

// app.get("/",(req,res)=>{
//   res.send("Hello")
  
// })



// Step 5:
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));