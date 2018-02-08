var port = process.env.PORT || 3000;
const path = require('path');
const http = require('http');
const express = require('express');

const socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(path.join(__dirname,'../public')));

const publicPath = path.join(__dirname,'../public');


io.on('connection',(socket)=>{
  console.log('New User Connected');
});

server.listen(port,()=>{
  console.log(`Server running on port ${port} `);
})
