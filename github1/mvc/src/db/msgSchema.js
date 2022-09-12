const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
    chatName : {type: 'string', require: true},
    message:[
        {
            sender:{type: 'string', require: true},
            receiver: {type: 'string', require: true},
            message: {type: 'string', require: true},
            date: {type: Date, default: Date.now}
        }
    ]
})

const msgModel = mongoose.model('Message',msgSchema);
module.exports = {msgModel};