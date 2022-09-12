var express = require("express");
var app = express();

var port = process.env.PORT || 3000 ;

app.get("/",(req,res)=>{
    res.send("Hi");
})

app.listen(port,()=>{
    console.log("connection at port number 3000");
});