const mysql = require("mysql")


const connection = mysql.createConnection({
    host: "localhost",
    user:"root",
    password: "root123",
    database:"ecommerce"
  });


  module.exports=connection;