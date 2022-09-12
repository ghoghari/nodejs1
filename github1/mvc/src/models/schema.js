var mongoose = require("mongoose");
var express = require("express");
var validator = require("validator")

var firstSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true]
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new error("Email is not valid");
            }
        }
    },
    complete: {
        type: String
    },
    otp: {
        type: Number
    },
    token: {
        type: String
    },
    forgettimetoken: {
        type: String
    },
    multilogout: {
        type: String
    },
    userimg: {
        data: Buffer,
        contentType: String
    },
    Followers: {
        type: Array,
    },
    Following: {
        type: Array,
    },
    // post: {
    //     type:Array,
    // }
    post :[ {
        data:Buffer,
        contentType:String,
        likes :Array,
        comments:Array
    }],
    Bio:{
        type: String
    },
    message:{
        
    }
});

var FirstCollection = mongoose.model("collectionname", firstSchema);
module.exports = FirstCollection;