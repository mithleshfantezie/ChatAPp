var port = process.env.PORT || 3000;
const path = require('path');
const http = require('http');
const express = require('express');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const socketIO = require('socket.io');
const {Users} = require('./utils/users');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(path.join(__dirname,'../public')));

const publicPath = path.join(__dirname,'../public');


io.on('connection',(socket)=>{
console.log('New User Connected');




socket.on('createLocationMessage',(coords)=>{
  var user = users.getUser(socket.id);
  if(user){
    io.to(user.room).emit('newLocationMessage', generateLocationMessage(`${user.name}`,coords.latitude,coords.longitude));
  }

});

socket.on('join', (params,callback)=>{
if(!isRealString(params.name) || !isRealString(params.room)){
return callback('Name and Room Name are Required.');
}
socket.join(params.room);
// socket.leave(params.room);
users.removeUser(socket.id);
users.addUser(socket.id,params.name,params.room);

var members = users.getUserList(params.room);


io.to(params.room).emit('updateUserList', users.getUserList(params.room));
socket.emit('newMessage',generateMessage('Admin','Welcome to the Chat App'));

socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} User Joined`));
io.to(params.room).emit('newMessage',generateMessage('Admin', `Currently in the Room: ${members}.`));

callback();
});

  socket.on('createMessage',(message, callback)=>{
var user = users.getUser(socket.id);

if(user && isRealString(message.text)){
io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
}

callback();
// socket.broadcast.emit('newMessage',{
//   from: message.from,
//   text: message.text,
//   createdAt: new Date().getTime()
// });
  });



  socket.on('disconnect',()=>{

  var user = users.removeUser(socket.id);

  if(user) {
    io.to(user.room).emit('updateUserList',users.getUserList(user.room));
    io.to(user.room).emit('newMessage',generateMessage('Admin', `${user.name} has left.`));
    var members = users.getUserList(user.room);
    io.to(user.room).emit('newMessage',generateMessage('Admin', `Currently in the Room: ${members}.`));
  }
  });
});



server.listen(port,()=>{
  console.log(`Server running on port ${port} `);
});

// https://www.google.com/maps?q=26.5666132,88.0684814
