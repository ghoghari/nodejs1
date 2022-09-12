var express = require("express");
const router = express.Router();
var { class1, upload,multerfunction , uploadpost } = require('./controller');
// var {class1} = require('./controller');

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

const http = require('http').createServer(app)
app.use(express.static('public'))

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
})

router.get('/', (req, res) => {
    res.send(process.env.SECRET_KEY);
})

router.get('/signup', class1.a);
// router.post('/signup',upload,class1.b);
router.post('/signup', class1.b);
router.get('/otp', class1.c);
router.post('/otp', class1.d);
router.get('/login', class1.e);
router.post('/login', class1.login);
// router.get('/first', class1.g);
router.get('/about', class1.h);
router.get('/logout', class1.k);
router.get('/forget', class1.l);
router.get('/forget/:forgettimetoken', class1.m);
router.post('/forget/:refresh', class1.n);
router.get('/multi', class1.o);
router.get('/chat', class1.p);
router.get('/profile', class1.q);
router.get('/profile2', class1.q2);
router.get('/edit', class1.r);
router.post('/edit', upload.single('filename') ,class1.rr);
router.get('/story', class1.s);
router.get('/reels', class1.t);
router.get('/following/:_id', class1.following);
router.get('/followers', class1.u);
router.get('/post' , class1.v);
router.post('/post', uploadpost.single('filename') , class1.vv);
router.get('/suggestions', class1.w);
// router.get('/message', class1.x);
router.get('/message/:_id', class1.y);
router.get('/like/:_id1/:_id2/:_id3', class1.zzz);
router.get('/like/:_id1/:_id2/', class1.zzzz);
router.get('/comment/:_id1/:_id2', class1.comment);
router.post('/comment/:_id1/:_id2', class1.comment2);
router.get('/console', class1.console);

module.exports = router;