const express = require('express');
const socket = require("socket.io");
var mongoose = require('mongoose');

var url = 'mongodb://shahzaib:shahg123@ds063150.mlab.com:63150/chating';

mongoose.connect(url,{ useNewUrlParser: true });

//models
const Chat = require('./models/chat');

//App Setup
const app = express();

//Static Files

app.use(express.static('public'));


const server = app.listen(3000,()=>{
    console.log('Listen to port 3000');
});

//Socket Setup

const io = socket(server);

io.on('connection',(socket)=>{
    Chat.find({}, function(err, docs) {
      if(err) throw err;
      socket.emit("loadold", docs);
   });

    console.log('Made Scoket Connection',socket.id);

    //Handle Event
    socket.on('chat',(data)=>{
        if(data.message !== ""){
        io.sockets.emit('chat',data);
        Chat.create({name : data.handle , msg : data.message},(err,res)=>{
            if(err){
                console.log(err);
            }
        });
    }
    });

    socket.on('typing',(data)=>{
          socket.broadcast.emit('typing',data);
        
    });
});