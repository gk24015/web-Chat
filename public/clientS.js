const socket = io(); //location of where server is hosting socket app

socket.on('chat-message', data =>{
    console.log(data)
});

// query DOM
const message = document.getElementById('message');
      handle = document.getElementById('handle');
      button =  document.getElementById('submit');
      output = document.getElementById('output');
      typing = document.getElementById('typing');

// Emit events

button.addEventListener('click', () =>
{
    socket.emit('chat', {//here chat is variable
        message: message.value,
        handle: handle.value
    })
    document.getElementById('message').value="";//clearing messege from box once typed
}) 

//sending the typing messege
message.addEventListener('keypress',() =>{
    socket.emit('userisTyping',handle.value)
  // document.getElementById('message')="";
} )
// Listen to events
// here chat is variable could be anything
socket.on('chat', (data)=>{
    typing.innerHTML="";  //while texting is typing string should be ""
    output.innerHTML += '<p> <strong>' + data.handle + ': </strong>' + data.message + '</p>'
   // typing.innerHTML=" ";
})

socket.on('userisTyping',(data)=>{
    typing.innerHTML='<p><em>'+data+'isTyping...</em></p>'
})