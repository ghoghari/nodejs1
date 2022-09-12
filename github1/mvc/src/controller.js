var jwt = require("jsonwebtoken");
var FirstCollection = require("./models/schema");

var express = require("express");
var app = express();
var mongoose = require("mongoose");
var port = process.env.PORT || 3500;

require('dotenv').config();

var ejs = require("ejs");
var path = require("path");
var ejs_folder_path = path.join(__dirname, "../templates");
app.set("view engine", "ejs");
app.set("views", ejs_folder_path);

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

var multer = require("multer");

// const dirname = path.join(__dirname);
// const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, dirname + '/public')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, uniqueSuffix + '.jpg')
//     }
// })
// const upload = multer({ storage: storage }).single('userimg');  // here we are remove unnecessary space

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname) + '/public/profilephotos')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '.jpg')
    }
})
const upload = multer({ storage: storage });

const storagepost = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname) + '/public/uploadpost')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '.jpg')
    }
})
const uploadpost = multer({ storage: storagepost });

const publicdir = path.join(__dirname, './public')
var {msgModel} = require("./db/msgSchema");

class class1 {

    static a = async (req, res) => {
        await FirstCollection.find({ complete: "no" }).deleteMany();
        res.render('home');
    }

    static b = async (req, res) => {

        var token = jwt.sign({ username: req.body.username }, process.env.SECRET_KEY);
        var userverify = await jwt.verify(token, process.env.SECRET_KEY);

        res.cookie("token", token);

        function between(min, max) {
            return Math.floor(
                Math.random() * (max - min) + min
            )
        }

        var otp = between(100000, 999999);

        await FirstCollection.find({complete:"no"}).deleteMany();  // i was change this in above get route

        try {

            if (req.body.password == req.body.confirmpassword) {

                var addingMensRecords = new FirstCollection(
                    {
                        username: req.body.username,
                        password: await bcrypt.hash(req.body.password, 12),
                        confirmpassword: req.body.confirmpassword,
                        Email: req.body.Email,
                        otp: otp,
                        complete: "no",
                        multilogout: "no",
                        token: token,
                        // userimg:{
                        //     data: fs.readFileSync(path.join(__dirname + '/public/' +req.file.filename)),
                        //     contentType: 'image/png'
                        // }
                        userimg: {
                            data: fs.readFileSync(path.join(__dirname + '/public/profile_pic.png')),
                            contentType: 'image/png'
                        },
                        Following:[],
                        Followers:[],
                        // post:[{
                        //     data: fs.readFileSync((__dirname + '/public/bhavik/allpost/bhavik1.jpg')),
                        //     contentType: 'image/png'
                        // },{
                        //     data: fs.readFileSync((__dirname + '/public/bhavik/allpost/bhavik2.jpg')),
                        //     contentType: 'image/png'
                        // }]
                        // post:[{
                        //     data: fs.readFileSync((__dirname + '/public/hetal/allpost/hetal.jpg')),
                        //     contentType: 'image/png'
                        // }]

                        // post:[{
                        //     data: fs.readFileSync((__dirname + '/public/hetal/allpost/hetal.jpg')),
                        //     contentType: 'image/png',
                        //     likes:[],
                        //     comments:[]
                        // }]
                        // post:[{
                        //     data: fs.readFileSync((__dirname + '/public/bhavik/allpost/bhavik1.jpg')),
                        //     contentType: 'image/png',
                        //     likes:[],
                        //     comments:[]
                        // },{
                        //     data: fs.readFileSync((__dirname + '/public/bhavik/allpost/bhavik2.jpg')),
                        //     contentType: 'image/png',
                        //     likes:[],
                        //     comments:[]
                        // }],

                        Bio: "" ,

                        post:[],

                    });

                await addingMensRecords.save();

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'ghogharinikunj97@gmail.com',
                        pass: 'tjgjgbpgzsujdnsi'
                    }
                });

                var mailOptions = {
                    from: 'ghogharinikunj97@gmail.com',                   // sender's gmail
                    to: `${req.body.Email}`,                  // receiver's gmail
                    subject: 'one time otp',     //subject
                    text: `${otp}`                      //message Description
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                });
                res.redirect('/otp');

            } else {
                alert("password and confirm password does not match");
                res.redirect('/signup');
            }

        } catch (e) {
            alert("user already available");
            res.redirect('/signup');
        }

    }

    static c = async (req, res) => {
        res.render('otp');
    }

    static d = async (req, res) => {

        try {

            var user = await FirstCollection.findOne({ token: req.cookies.token });

            if (req.body.otp == user.otp) {

                var updateuser = await FirstCollection.findOneAndUpdate({ token: req.cookies.token }, { $set: { complete: "yes" } });
                await updateuser.save();

                res.redirect('login');

            }

            else {
                await FirstCollection.findOne({ complete: "no" }).deleteOne();
                alert("otp invalid");
                res.redirect('signup');
            }

        } catch (e) {

        }

    }

    static e = (req, res) => {
        res.render('login');
    }

    static f = async (req, res) => {

        await FirstCollection.find({ complete: "no" }).deleteMany();

        try {

            var addingMensRecords = new FirstCollection(
                {
                    username: req.body.loginusername,
                    password: "password",
                    confirmpassword: "confirmpassword",
                    Email: "Email@gmail.com",
                    complete: "no"

                });

            await addingMensRecords.save();

            await FirstCollection.findOne({ password: "password" }).deleteOne();

            alert("username not find");

            res.redirect('/signup');

        } catch (e) {

            var logindata = await FirstCollection.findOne({ username: req.body.loginusername })

            var Passwordmatch = await bcrypt.compare(req.body.loginpassword, logindata.password);

            if (Passwordmatch) {

                var tokeen = jwt.sign({ username: req.body.loginusername }, process.env.SECRET_KEY);
                var userverify = await jwt.verify(tokeen, process.env.SECRET_KEY);

                //     res.cookie("tokeen"
                //     ,tokeen 
                // , {
                //     expires: new Date(Date.now()+300000) // here we are write milisecond
                //     ,httpOnly:true // if we are write this lines so user does not removes or modifies cookies
                //     // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
                // }
                // );

                res.cookie("token", logindata.token
                    , {
                        httpOnly: true // if we are write this lines so user does not removes or modifies cookies
                        // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
                    });

                res.redirect('/first');

            }

            else {

                alert("password does not match");
                res.redirect('/login');

            }
        }

    }

    static login = async (req, res) => {

        await FirstCollection.find({ complete: "no" }).deleteMany();

        try {

            var logindata = await FirstCollection.findOne({ username: req.body.loginusername })

            var Passwordmatch = await bcrypt.compare(req.body.loginpassword, logindata.password);

            if (Passwordmatch) {

                var tokeen = jwt.sign({ username: req.body.loginusername }, process.env.SECRET_KEY);
                var userverify = await jwt.verify(tokeen, process.env.SECRET_KEY);

                res.cookie("tokeen"
                    , tokeen
                    , {
                        expires: new Date(Date.now() + 300000) // here we are write milisecond
                        , httpOnly: true // if we are write this lines so user does not removes or modifies cookies
                        // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
                    }
                );

                res.cookie("token", logindata.token
                    , {
                        httpOnly: true // if we are write this lines so user does not removes or modifies cookies
                        // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
                    });

                //  res.redirect('/first');

                

                res.redirect('story');

            } else {

                alert("password does not match");
                res.redirect('/login');

            }

        } catch (error) {

            alert("username not find");
            res.redirect('/signup');

        }
    }

    // static g = async (req, res) => {

    //     try {

    //         var userverify = await jwt.verify(req.cookies.tokeen, process.env.SECRET_KEY);

    //         // var logindata = await FirstCollection.findOne({ username: req.body.loginusername })

    //         if (userverify) {

    //             var a = await FirstCollection.findOne({ token: req.cookies.token })
    //             var b = a.username  // login username

    //             var ar = await FirstCollection.find();
    //             var supplies = []

    //             ar.forEach(element => {

    //                 if (element.username != b) {

    //                     // supplies.push(element.username);
    //                     supplies.push(element);

    //                 }

    //             });

    //             // var supplies = [0,1,2]

    //             function PUSH() {
    //                 c.push(a, supplies);
    //             }
    //             var c = [];
    //             PUSH();

    //             // res.render('profile' , { c });  // supplies = c[1]
    //             res.render('random', { c });  // supplies = c[1]

    //         } else {
    //             res.redirect('login');
    //         }

    //     } catch (e) {
    //         res.redirect('login');
    //     }

    // }

    static h = async (req, res) => {
        try {

            var userverify = await jwt.verify(req.cookies.tokeen, process.env.SECRET_KEY);

            if (userverify) {
                res.render('about');
            } else {
                res.redirect('login');
            }

        } catch (e) {
            res.redirect('login');
        }
    }

    static k = async (req, res) => {
        res.clearCookie("tokeen");
        res.redirect('login');
    }

    static l = async (req, res) => {

        try {

            var forgettoken = jwt.sign({ token: req.cookies.token }, process.env.SECRET_KEY);

            res.cookie("forgettoken", forgettoken
                , {
                    expires: new Date(Date.now() + 10000) // here we are write milisecond
                    , httpOnly: true // if we are write this lines so user does not removes or modifies cookies
                    // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
                });

            let update_data = await FirstCollection.findOneAndUpdate({ token: req.cookies.token }, { $set: { forgettimetoken: forgettoken } });

            var userverify = await jwt.verify(req.cookies.tokeen, process.env.SECRET_KEY);

            if (userverify) {

                var forgetEmail = await FirstCollection.findOne({ token: req.cookies.token });

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'ghogharinikunj97@gmail.com',
                        pass: 'tjgjgbpgzsujdnsi'
                    }
                });

                var mailOptions = {
                    from: 'ghogharinikunj97@gmail.com',                   // sender's gmail
                    to: `${forgetEmail.Email}`,                  // receiver's gmail
                    subject: 'one time otp',     //subject
                    text: `http://localhost:3500/forget/${forgettoken}`                      //message Description
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {

                    }

                    res.end();

                });

            }

        } catch (e) {
            res.redirect('login');
        }

    }

    static m = async (req, res) => {

        try {

            var userverify = await jwt.verify(req.cookies.forgettoken, process.env.SECRET_KEY);

            if (userverify) {
                res.render('forget');
            } else {
                res.redirect('/first')
            }

        } catch (e) {
            res.redirect('/first')
        }

    }

    static n = async (req, res) => {

        var update_data = await FirstCollection.findOneAndUpdate({ token: req.cookies.token }, {
            $set: {
                password: await bcrypt.hash(req.body.newpassword, 12),
                confirmpassword: req.body.newpassword
            }
        });

        alert("password change");

    }

    static o = async (req, res) => {

        var update_data = await FirstCollection.findOneAndUpdate({ token: req.cookies.token }, { $set: { multilogout: "yes" } });

        res.cookie("multilogout", "yes"
            , {
                httpOnly: true // if we are write this lines so user does not removes or modifies cookies
                // ,secure:true  // this cokkie is run only where their secure connections are presents means http connections
            });

        res.redirect('login');

    }

    static p = async (req, res) => {

        var chatuser = await FirstCollection.find({ token: req.cookies.token })
        var loginchatuser = chatuser[0].username

        res.cookie("loginchatuser", loginchatuser);

        res.render('chat', { loginchatuser })

    }

    static q = async (req, res) => {

        try {

            var userverify = await jwt.verify(req.cookies.tokeen, process.env.SECRET_KEY);

            // var logindata = await FirstCollection.findOne({ username: req.body.loginusername })

            if (userverify) {

                var a = await FirstCollection.findOne({ token: req.cookies.token })
                var abcd = a.Following
                var b = a.username

                var ar = await FirstCollection.find();
                var supplies = []
                var supplies1 = []
                var supplies4 = []
                var supplies5 = []
                var last = []  

                ar.forEach(element => {

                    if (element.username != b) {

                        supplies.push(element);

                    }
                    
                });

                function PUSH() {
                    c.push(a, supplies);
                }
                var c = [];
                PUSH();

                for (let i = 0; i < supplies.length ; i++) {
                    
                    supplies1.push(supplies[i].userimg);
                    supplies4.push(supplies[i].username);
                    supplies5.push(supplies[i]);

                function isInArray(value, array) {
                    return array.indexOf(value) > -1;
                  }

                var ologic = isInArray(supplies4[i], abcd);

                last.push(ologic);

                  }

                res.render('profile', { a , c , supplies , supplies1 , supplies4 , supplies5 , abcd , last})
                
            } else {
                res.redirect('login');
            }

        } catch (e) {
            res.redirect('login');
        }

    }

    static q2 = async (req, res) => {

        try {

            var userverify = await jwt.verify(req.cookies.tokeen, process.env.SECRET_KEY);

            // var logindata = await FirstCollection.findOne({ username: req.body.loginusername })

            if (userverify) {

                var a = await FirstCollection.findOne({ token: req.cookies.token })
                var abcd = a.Following
                var b = a.username  // login username

                var ar = await FirstCollection.find();
                var supplies = []
                var supplies1 = []
                var supplies4 = []
                var supplies5 = []
                var last = []  

                ar.forEach(element => {

                    if (element.username != b) {

                        // supplies.push(element.username);
                        supplies.push(element);

                    }
                    
                });

                function PUSH() {
                    c.push(a, supplies);
                }
                var c = [];
                PUSH();

                for (let i = 0; i < supplies.length ; i++) {
                    
                    supplies1.push(supplies[i].userimg);
                    supplies4.push(supplies[i].username);
                    supplies5.push(supplies[i]);

                function isInArray(value, array) {
                    return array.indexOf(value) > -1;
                  }

                var ologic = isInArray(supplies4[i], abcd);

                last.push(ologic);

                  }

                // res.render('profile' , { c });  // supplies = c[1]
                res.render('profile2', { c , supplies , supplies1 , supplies4 , supplies5 , abcd , last})  // supplies = c[1]
                
            } else {
                res.redirect('login');
            }

        } catch (e) {
            res.redirect('login');
        }

    }

    static r = async (req, res) => {
        var user = await FirstCollection.findOne({ token: req.cookies.token });
        var usernames = user.username
        var bio = user.Bio
        var userimage = user.userimg
        res.render('edit' , { userimage , usernames , bio })
    }

    static rr = async (req, res) => {
        // console.log(req.body)
        // // console.log(req.body.name)

        // var user = await FirstCollection.findOne({ token: req.cookies.token });
        // user.username = req.body.username
        // user.Bio = req.body.bio

        // user.save();

        // res.redirect('/profile');

        console.log(req.file);

        if(req.file){
            var user = await FirstCollection.findOne({ token: req.cookies.token });
            user.username = req.body.username
            user.Bio = req.body.bio
            user.userimg ={
                data: fs.readFileSync(path.join(__dirname + `/public/profilephotos/${req.file.filename}`)),
                contentType: 'image/png'
            }
    
            user.save();
        }else{
            var user = await FirstCollection.findOne({ token: req.cookies.token });
            user.username = req.body.username
            user.Bio = req.body.bio
    
            user.save();
        }

        // fs.unlink(path, function (err) { // path means full path
        var paths = path.join(__dirname + `/public/profilephotos/${req.file.filename}`);
        fs.unlink(paths, function (err) {
            if (err) {
              console.error(err);
            } else {
              console.log("File removed:", path);
            }
          }); // this function is for delete file

        res.redirect('/profile');

    }

    static s = async (req, res) => {

        var a = await FirstCollection.findOne({ token: req.cookies.token })

        var ab = a.userimg

        var abcd = a.Following
        var b = a.username  // login username

        var ar = await FirstCollection.find();
        var supplies = []
        var supplies1 = []
        var supplies4 = []
        var d = []
        var com = [] // it's set 0 index value bcz ortherwise when user first times like then does not redirect

        ar.forEach(element => {

            if (element.username != b) {

                // supplies.push(element.username);
                supplies.push(element);

            }
            
        });

        for (let i = 0; i < supplies.length ; i++) {
            
            supplies1.push(supplies[i].userimg);
            supplies4.push(supplies[i].username);

            }

        //   var a = await FirstCollection.findOne({ token: req.cookies.token })
        //   var abcd = a.Following
        //   var b = a.username  // login username

        //   var ar = await FirstCollection.find();
        //   var supplies = []
        //   var supplies1 = []
        //   var supplies4 = []
        //   var supplies5 = []
        //   var last = []  

        //   ar.forEach(element => {

        //       if (element.username != b) {

        //           // supplies.push(element.username);
        //           supplies.push(element);

        //       }
              
        //   });

        //   function PUSH() {
        //       c.push(a, supplies);
        //   }
        //   var c = [];
        //   PUSH();

        //   for (let i = 0; i < supplies.length ; i++) {
              
        //       supplies1.push(supplies[i].userimg);
        //       supplies4.push(supplies[i].username);
        //       supplies5.push(supplies[i]);

        //   function isInArray(value, array) {
        //       return array.indexOf(value) > -1;
        //     }

        //   var ologic = isInArray(supplies4[i], abcd);

        //   last.push(ologic);

        //     }

        var abc = await FirstCollection.find()

        res.render('story' , { a , b , ab , abc , supplies1 , supplies4 , com , d })
    }

    static t = async (req, res) => {
        res.render('reels')
    }

    static following = async(req,res)=>{

        // console.log(req.params);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var a = await FirstCollection.findOne({ _id: req.params })

        // console.log(a.username)  // not our account

        var array2 = []
        array2.push(a.username)
        // console.log(array2)
        
        var b = await FirstCollection.find({ token: req.cookies.token })
        var array = b[0].Following  // our old account array

        function isInArray(value, array) {
            return array.indexOf(value) > -1;
          }

        var tf = isInArray(a.username, b[0].Following);

        if(tf){
            array.remove(a.username);
            // array.remove(array2);
        }else{
            array.push(a.username);
            // array.push(array2);
        }

        var updateuser = await FirstCollection.findOneAndUpdate({ token: req.cookies.token }, { $set: { Following : array } });
        await updateuser.save();

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var c = await FirstCollection.findOne({ _id: req.params })
    var d = c.Followers
    // console.log(d)  // not our account 

    // var e = await FirstCollection.find({ token: req.cookies.token })
    var g = b[0].username
    // console.log(b[0].username)  // our account username

    var tfs = isInArray(b[0].username, c.Followers);

    if(tfs){
        d.remove(g)
    }else{
        d.push(g)
    }

    var updateusers = await FirstCollection.findOneAndUpdate({ _id: req.params }, { $set: { Followers : d } });
    await updateusers.save();

    res.redirect('/suggestions');

    }

    static u = async(req,res)=>{

        var followings = await FirstCollection.find({ token: req.cookies.token })
        var following = followings[0].Following
        var array2 = [];

        for(var j=0;j<following.length;j++){
            var d = following[j]
            var arr = await FirstCollection.find({username:d});
            array2.push(arr[0].userimg);
        }

        res.render('following', { following , array2 } )
    } 

    static v = async(req,res)=>{

        res.render('post')

    }

    static vv = async(req,res)=>{

        // console.log(req.file);

        var pic = req.file.filename

        var loginuser = await FirstCollection.findOne({ token: req.cookies.token });
        var loginuserpost = loginuser.post

        var pushdata = {
                data: fs.readFileSync((__dirname + `/public/uploadpost/${pic}`)),
                contentType: 'image/png',
                likes:[],
                comments:[]
            }

        loginuserpost.push(pushdata)

        loginuser.save();

        var paths = path.join(__dirname + `/public/uploadpost/${pic}`);
        fs.unlink(paths, function (err) {
            if (err) {
              console.error(err);
            } else {
              console.log("File removed:", path);
            }
          });  // for delete file

        res.redirect('/story')

    }

    static w = async(req,res)=>{

        var a = await FirstCollection.findOne({ token: req.cookies.token })
        var abcd = a.Following
        var b = a.username  // login username

        var ar = await FirstCollection.find();
        var supplies = []
        var supplies1 = []
        var supplies4 = []
        var supplies5 = []
        var last = [] 

        ar.forEach(element => {

            if (element.username != b) {

                // supplies.push(element.username);
                supplies.push(element);

            }
            
        });

        for (let i = 0; i < supplies.length ; i++) {
            
            supplies1.push(supplies[i].userimg);
            supplies4.push(supplies[i].username);
            supplies5.push(supplies[i]);

              function isInArray(value, array) {
              return array.indexOf(value) > -1;
            }

            var ologic = isInArray(supplies4[i], abcd);

            last.push(ologic);

          }

        res.render('suggestions' , { supplies1 , supplies4 , last , supplies5 } )

    }

    // static x = async(req,res)=>{

    // var user = await FirstCollection.findOne({ token: req.cookies.token });
    // console.log(user.username)

    // res.sendFile(publicdir+'/message.html')

    // }

    static y = async(req,res)=>{

        // var a = "ab" ;
        // var b = "c" ;
        // var c = `${a}${b}`
        // console.log(c)

        // console.log(req.params._id);  // friend name
        var users = await FirstCollection.findOne({ username: req.params._id });

        var user = await FirstCollection.findOne({ token: req.cookies.token });
        var abd = user.username
        // console.log(abd)

        res.cookie("abd", abd);
        
        // console.log(user.username)

        var a = await FirstCollection.find({ })

        for(i=0;i<a.length;i++){
            if(a[i].username == users.username) {
                var b = i
            }
        }

        for(var i=0;i<a.length;i++){
            if(a[i].username == user.username) {
                var c = i
            }
        }

        if(b<c){
            var d = `${users.token}${user.token}`
        }else{
            var d = `${user.token}${users.token}`
        }

        // console.log(d)
        res.cookie("d", d);

        res.render('message' , { user , d , abd })
        // res.sendFile(publicdir+'/message.html' , { user , b })
        // res.sendFile(publicdir+'/chat.html')
    
        }

    static zzz = async(req,res)=>{

        console.log('like exist');

        var updateuser = await FirstCollection.find({ token: req.cookies.token });
        var ourusername = updateuser[0].username
        // console.log(ourusername);
        let _id2 = req.params._id2;
        // console.log(req.params)
        // console.log(req.params._id1)
        // console.log(req.params._id2)
        // console.log(req.params._id3)

        var likeuser = await FirstCollection.find({ username:req.params._id1 });
        let likearray = likeuser[0].post[_id2].likes

        // console.log(likearray);
        // console.log(ourusername);

        function arrayRemove(arr, value) {
 
            return arr.filter(function(geeks){
                return geeks != value;
            });

        }

        var result = arrayRemove(likearray, ourusername);
        // console.log(result);
      
        // var updateusers=await FirstCollection.findOneAndUpdate({ username:"bhavik" } , { $set: { "post.$[].likess": ["dgbvdrg","abcd"] } });
        // await updateusers.save();

        var users = await FirstCollection.findOne({username: req.params._id1})
        users.post[_id2].likes = result;
        users.save();

        // var b = 'Hi'
        // console.log(typeof b);
        res.redirect('/story');

    }

    static zzzz = async(req,res)=>{

        console.log('like does not exist');

        let updateuser = await FirstCollection.findOne({token: req.cookies.token})
        var ourusername = updateuser.username

        // console.log(req.params)
        // console.log(req.params._id1)

        let user = await FirstCollection.findOne({username: req.params._id1})
        // console.log(user.post[req.params._id2].likes)

        // user.post[req.params._id2].likes[0] = "nikunj";

        var results = user.post[req.params._id2].likes
        results.push(ourusername)

        user.post[req.params._id2].likes = results;
        user.save();

        res.redirect('/story');

    }

    static comment = async (req, res) => {
        var loginuser = await FirstCollection.findOne({ token: req.cookies.token });
        var loginusername = loginuser.username
        res.render('comment' , { loginusername });
    }

    static comment2 = async (req, res) => {

        var loginuser = await FirstCollection.findOne({ token: req.cookies.token });
        var loginusername = loginuser.username

        // console.log(req.body)
        // console.log(req.params)
        // console.log(req.params._id1)

        var a = await FirstCollection.findOne({ username: req.params._id1 });
        var b = a.post[req.params._id2].comments

        var c = [loginuser.username , req.body.comment ]

        b.push(c);

        console.log(b)

        a.save();

        res.redirect(`${req.params._id2}`)
    }

    static console = async(req,res) => {
        res.render('console');
    }

}


module.exports = { class1, upload , uploadpost };
// module.exports = {class1};