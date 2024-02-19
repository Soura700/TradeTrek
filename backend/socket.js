const express = require("express");
const app = express();
const server = require("http").Server(app);


const io = require("socket.io")(server,{
  cors:{
    origin:'http://localhost:3000'
  }
}).listen(8000);



module.exports = io;
