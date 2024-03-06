const mysql = require("mysql")


const connection = mysql.createConnection({
    // host: "localhost",
    host:"host.docker.internal",
    user:"root",
    password: "root123",
    database:"ecommerce"
  });


  module.exports=connection;