const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
var connection = require("./connection")
var registerAuth = require("./routes/registerAuth")
var createProduct = require("./routes/products");




// Step 1:
dotenv.config();

// Step 2:
app.use(express.json());
// Step 3:
// const connection = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE
//   });


// Making the connetion with the database 


// const connection = mysql.createConnection({
//     host: "localhost",
//     user:"root",
//     password: "root123",
//     database:"users"
//   });



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

// app.use("/api/auth",registerAuth);

app.use("/api/create",createProduct);



// Step 5:
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));