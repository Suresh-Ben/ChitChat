const socket = io('http://localhost:3000/');
import * as manager from "./requires/manager.js";
import * as searchManager from "./requires/searchManager.js";
import * as chatManager from "./requires/chatManager.js";

const cookies = {};
var pairs = document.cookie.split(";");
for (var i=0; i<pairs.length; i++){
  var pair = pairs[i].split("=");
  cookies[(pair[0]+'').trim()] = unescape(pair.slice(1).join('='));
}

$(".search-bar input").on('input',(err)=>{
  const inp = $(".search-bar input");
  if(inp.val() == "")
  {
    $(".search-list").html("");
    searchManager.addTip();
    return;
  }
  sendLoadReq(inp.val());
});
//Networking
socket.on('connection');
socket.emit('joinChat', cookies);

socket.on('joining', function(data) {
  let joinSecret = $((document.createElement('p')));
  joinSecret.addClass("join-secret");
  let text = data + " joined the chat";
  joinSecret.html(text);

  let joinBox = $((document.createElement('div')));
  joinBox.addClass("join-box");
  joinBox.append(joinSecret);

  $(".message-container").append(joinBox);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('message', function(data) {
  loadMeassage(data.name, data.secret, false);
});

socket.on('loadUsers', function(data){
  $(".search-list").html("");
  for(let i =0; i < data.length; i++)
  {
    loadUser(data[i]);
  }
  $(".search-item a").click(function(){
    const clientName = $(this).attr("class");
    loadUserChat(clientName);
  });
});

function sendMessage() {
  let input = $('.input-message');

  const userID = cookies.id;
  const message = input.val();
  input.val("");

  const data = {
    id : userID,
    message : message
  }

  loadMeassage("Me", message, true);
  socket.emit('message', data);
}

function loadMeassage(sender, data, myMessage) {

  if (data == "") return;

  let name = $((document.createElement('p')));
  name.addClass("name");
  name.html(sender);

  let secret = $((document.createElement('p')));
  secret.addClass("secret");
  secret.html(data);

  let message = $((document.createElement('div')));
  message.addClass("message");
  message.append(name);
  message.append(secret);

  let messageBox = $((document.createElement('div')));
  messageBox.addClass("message-box");
  messageBox.append(message);

  if (myMessage) {
    messageBox.addClass("my-message-box");
    message.addClass("my-message");
  }

  $(".message-container").append(messageBox);
  window.scrollTo(0, document.body.scrollHeight);


}

function sendLoadReq(data){
  socket.emit('searchUsers', data);
};

function loadUser(data){
  let name = $((document.createElement('p')));
  name.html(data.userID);

  let img = $((document.createElement('img')));
  if(!data.userDP)
    img.attr("src", "content/images/nullDP.jpg");
  else
    console.log("found img");
    //Todo -- load user DP

  let userDIV = $((document.createElement('div')));
  userDIV.addClass("user-detail");
  userDIV.append(img);
  userDIV.append(name);

  let message = $((document.createElement('a')));
  message.html("Message");
  message.addClass(data.userID);

  let searchItem = $((document.createElement('div')));
  searchItem.addClass("search-item");
  searchItem.append(userDIV);
  searchItem.append(message);

  $(".search-list").append(searchItem);
}

function loadUserChat(clientName){
  manager.openChatBox();
  manager.closeSearchEngine();

  const data = {
    userName : cookies.id,
    clientName : clientName
  }
  socket.emit('joinRoom', data);
}
