var express = require("express");
var app = express();
var mongoose = require("mongoose");
var port = process.env.PORT || 3500;
require("./db/conn");
var FirstCollection = require("./models/schema");

require('dotenv').config();

var ejs = require("ejs");
var path = require("path");
var ejs_folder_path = path.join(__dirname, "../templates");
app.set("view engine", "ejs");
app.set("views", ejs_folder_path);

var jwt = require("jsonwebtoken");

var bodyParser = require("body-parser");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var bcrypt = require("bcryptjs");

var nodemailer = require('nodemailer');

var fs = require('fs');

let alert = require('alert');

var multer = require("multer");

app.use(express.static("public"));

const router = require('./routers');

app.use('/', router);

var http = require("http").createServer(app);
var io = require("socket.io")(http);
const {joinUser, removeUser, findUser} = require('./users');
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
let thisRoom = "";
io.on("connection", function (socket) {
  console.log("connected");
  socket.on("join room", (data) => {
    console.log('in room');
    let Newuser = joinUser(socket.id, data.username,data.roomName)
    //io.to(Newuser.roomname).emit('send data' , {username : Newuser.username,roomname : Newuser.roomname, id : socket.id})
   // io.to(socket.id).emit('send data' , {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname });
   socket.emit('send data' , {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname });
   
    thisRoom = Newuser.roomname;
    console.log(Newuser);
    socket.join(Newuser.roomname);
  });
  socket.on("chat message", (data) => {
    io.to(thisRoom).emit("chat message", {data:data,id : socket.id});
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log(user);
    if(user) {
      console.log(user.username + ' has left');
    }
    console.log("disconnected");

  });
});

http.listen(3500, function () {});

// app.listen(port , ()=>{
//     console.log("Okay");
// })  // it's required when we are use socket-io

// server.listen(port, () => {
//     console.log("Okay")
// })

const cors = require('cors');
app.use(express.json());
app.use(cors({
    origin: " http://192.168.1.96:3500"
}))


