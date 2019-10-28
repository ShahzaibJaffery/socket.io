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

app.use(express.static(__dirname +'/public/'));

const server = app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

//Socket Setup

const io = socket(server);


// function getUsers () {
//    var userNames = [];
//    for(var name in users) {
//      if(users[name]) {
//        userNames.push(name);  
//      }
//    }
//    return userNames;
// }

    var users = {};
    var userNumber = 1;
io.on('connection',(socket)=>{
    var myNumber = userNumber++;
    var myName = 'user#' + myNumber;
    users[myName] = socket;

    Chat.find({}, function(err, docs) {
      if(err) throw err;
      
      socket.emit("loadold", docs);
      
   });

    console.log('Made Scoket Connection',socket.id);
    //Handle Event
    socket.on('chat',(data)=>{

        if(data.message !== "" && data.handle!== ""){

           //PRIVATE
        //   console.log(users['user#3'].id);
        //   io.sockets.in(users['user#3'].id).emit('chat',data);

           //PUBLIC
        io.sockets.emit('chat',data);
        Chat.create({name : data.handle , msg : data.message},(err,res)=>{
            if(err){
                console.log(err);
            }else{
              console.log(res);
            }
        });
    }
    });

    socket.on('typing',(data)=>{
          socket.broadcast.emit('notifyTyping',{message : data.message});
        
    });

    socket.on("stopTyping", () => { socket.broadcast.emit("notifyStopTyping"); });

});