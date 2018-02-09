var port = process.env.PORT || 3000;
const path = require('path');
const http = require('http');
const express = require('express');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(path.join(__dirname,'../public')));

const publicPath = path.join(__dirname,'../public');


io.on('connection',(socket)=>{
console.log('New User Connected');



  socket.emit('newMessage',generateMessage('Admin','Welcome to the Chat App'));
  socket.on('createMessage',(message, callback)=>{
  socket.broadcast.emit('newMessage',generateMessage('Admin',`${message.from} has Joined`));
  callback('this is from server');
  // socket.broadcast.emit('newMessage',{
  //   from: message.from,
  //   text: message.text,
  //   createdAt: new Date().getTime()
  // });
    });



socket.on('createLocationMessage',(coords)=>{
  io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude,coords.longitude));
});

socket.on('join', (params,callback)=>{
if(!isRealString(params.name)){
  callback('Name is Required.');
}
callback();
});

  socket.on('createMessage',(message, callback)=>{
console.log('createMessage', message);
io.emit('newMessage',generateMessage(message.from,message.text));
callback('this is from server');
// socket.broadcast.emit('newMessage',{
//   from: message.from,
//   text: message.text,
//   createdAt: new Date().getTime()
// });
  });



  socket.on('disconnect',()=>{
    socket.on('createMessage',(message, callback)=>{
      socket.broadcast.emit('createMessage',generateMessage('Admin',`${message.from} has left.`));
  console.log('createMessage', message);
  io.emit('newMessage',generateMessage(message.from,message.text));
  callback('this is from server');
  // socket.broadcast.emit('newMessage',{
  //   from: message.from,
  //   text: message.text,
  //   createdAt: new Date().getTime()
  // });
    });


    console.log('User Disconnected');
  });
});



server.listen(port,()=>{
  console.log(`Server running on port ${port} `);
});

// https://www.google.com/maps?q=26.5666132,88.0684814
