//Make Connection

var socket = io();


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
    var name1 = $('#handle').val();
    var message1 = $('#message').val();

    if($.trim(name1).length == 0 && $.trim(message1).length == 0){
        alert("Please enter your name and message");
    }else if($.trim(name1).length == 0){
        alert("Please enter your name");
    }else if($.trim(message1).length == 0){
    alert("Please enter your message");
    }else{
    
    socket.emit('chat',{
        message : message.value,
        handle : handle.value
    });
}
});


message.addEventListener('keypress',(e)=>{
       socket.emit('typing',{message : "user is typing..."});
        if(e.keyCode == 13){
        $("#chat-window").stop().animate({ scrollTop: $("#mario-chat")[0].scrollHeight}, 1000);
        var name1 = $('#handle').val();
        var message1 = $('#message').val();

        if($.trim(name1).length == 0 && $.trim(message1).length == 0){
            alert("Please enter your name and message");
        }else if($.trim(name1).length == 0){
            alert("Please enter your name");
        }else if($.trim(message1).length == 0){
            alert("Please enter your message");
        }else{
         socket.emit('chat',{
            message : message.value,
            handle : handle.value

        });

    }
   }
});

message.addEventListener("keyup", () =>  {
    socket.emit("stopTyping", "");
});



//Load Old Messages
socket.on('loadold',(data)=>{
    output.innerHTML = "";
    $("#chat-window").stop().animate({ scrollTop: $("#mario-chat")[0].scrollHeight}, 1000);

    for (var i=0; i < data.length; i++) {
     output.innerHTML += '<P><strong>'+data[i].name+': </strong>'+data[i].msg+'</P>';
    }
});

//Listen for Events

socket.on('chat',(data)=>{
    feedback.innerHTML = "";
    $("#chat-window").stop().animate({ scrollTop: $("#mario-chat")[0].scrollHeight}, 1000);
    output.innerHTML += '<P><strong>'+data.handle+': </strong>'+data.message+'</P>';
    message.value = "";
});


socket.on("notifyTyping", data  =>  {
    feedback.innerHTML = '<p><em>'+data.message+'</em></p>';
});

socket.on("notifyStopTyping", () =>  {
    feedback.innerHTML  =  "";
    
});
