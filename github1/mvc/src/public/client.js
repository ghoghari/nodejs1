// var express = require("express");
// var app = express();
// var cookieParser = require('cookie-parser');
// app.use(cookieParser());

const socket = io()

let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')

// console.log((document.cookie).split('=')[1]);  // javascript cookies

do {
    // name = prompt('Please enter your name: ')
    name =  (document.cookie).split('=')[1];
} while(!name) 
    
textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
        e.target.value="";
    }
})

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }

    appendMessage(msg, 'outgoing')

    // Send to server 
    socket.emit('message', msg)

}

    function appendMessage(msg, type) {
        let mainDiv = document.createElement('div')
        let className = type
        mainDiv.classList.add(className, 'message')
    
        let markup = `
            <h4>${msg.user}</h4>
            <p>${msg.message}</p>
        `
        mainDiv.innerHTML = markup
        messageArea.appendChild(mainDiv)
    }

    // Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}