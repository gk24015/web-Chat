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
   // console.log(data);
    typing.innerHTML="";  //while texting is typing string should be ""
    output.innerHTML += '<p> <strong>' + data.handle + ': </strong>' + data.message + '</p>'
})

socket.on('userisTyping',(data)=>{
    typing.innerHTML='<p><em>'+data+'isTyping...</em></p>'
})




/* video part*/
//get the local video and display with permisiion
function getLVideo(callbacks){
 navigator.getUserMedia= navigator.getUserMedia ||navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
 var constraints ={
     audio:true,
     video:true
 }
 navigator.getUserMedia(constraints,callbacks.success,callbacks.error)

}
function recStream(stream , elemid)
{
    var video =document.getElementById(elemid);
    video.srcObject =stream;
    window.peer_stream =stream;
}
getLVideo({
    success:function(stream){
        window.localstream = stream;
        recStream(stream,'lVideo');//lVideo is defined in html
    },
    error: function(err){
        alert("cannot access your camera");
        console.log(err)
    }
})//till here you will be able to access your video


//
var conn;
var peer_id
//create peer connection
var peer = new Peer();

//display the peer on dom
peer.on('open',function(){
    document.getElementById("displayId").outerText = peer.id
    //console.log(peer.id);
})
peer.on('connection',function(connection){
   conn=connection;
   peer_id= connection.peer
   document.getElementById("connId").value=peer_id;
});
peer.on('error',function(err){
    alert("an error has happened :" +err)
    console.log(err);
})

//onclick with the connection 
document.getElementById('conn_button').addEventListener('click',function(){
    peer_id=document.getElementById("connId").value;//exchanging values
    if(peer_id){
        conn= peer.connect(peer_id)
    }
    else
    {
        alert("enter an id");
        return false;
    }
})
//call button then send offer snd answer is exchnaged
peer.on('call',function(call){
 var acceptCall = confirm("Do you wanna accept the call");

 if(acceptCall){
     call.answer(window.localstream);//inbuit function

     call.on('stream',function(stream){
         window.peer_stream =stream;
         recStream(stream,'rVideo')//if we accept call it will pass our video to client

     });
     call.on('close',function(){
     alert('the call has ended');})
 }
else
 {
     console.log("call denied")
 }
});

//ask to call
document.getElementById('call_button').addEventListener('click',function(){
    console.log("calling a peer:"+peer_id);
    console.log(peer);
    var call =peer.call(peer_id,window.localstream)
    call.on('stream',function(stream){
        window.peer_stream=stream;
        recStream(stream,'rVideo');
    })
})
//accept the call

//display local video on client
