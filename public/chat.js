//Make Connection

var socket = io('https://intense-bayou-12672.herokuapp.com/');

//Query Dom

const handle =  document.getElementById('handle');
const message =  document.getElementById('message');
const output =  document.getElementById('output');
const btn =  document.getElementById('send');
const feedback =  document.getElementById('feedback');

const name = 'user'+Math.floor((Math.random() * 1000) + 3);


//Emit Event

btn.addEventListener('click',(e)=>{
    e.preventDefault();
    socket.emit('chat',{
        message : message.value,
        handle : name
    });
});


message.addEventListener('keypress',(e)=>{
    
       socket.emit('typing',name);
        if(e.keyCode == 13){
         socket.emit('chat',{
            message : message.value,
            handle : name
        });
   }
});

//Load Old Messages
socket.on('loadold',(data)=>{
    for (var i=0; i < data.length; i++) {
     output.innerHTML += '<P><strong>'+data[i].name+': </strong>'+data[i].msg+'</P>';
    }
});

//Listen for Events

socket.on('chat',(data)=>{
    feedback.innerHTML = "";
    output.innerHTML += '<P><strong>'+data.handle+': </strong>'+data.message+'</P>';
    message.value = "";
});

socket.on('typing',(data)=>{
    feedback.innerHTML = '<p><em>'+ data +' is typing a message...</em></p>';
});