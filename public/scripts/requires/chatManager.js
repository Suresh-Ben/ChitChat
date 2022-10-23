import * as manager from "./manager.js";

//Chat-effects
$(".log-option-messages").click(()=>{
  $(".log-option-messages").addClass("log-option-selected");
  $(".log-option-groups").removeClass("log-option-selected");

  $(".chat-rooms").addClass("section-focus");
  $(".chat-groups").removeClass("section-focus");
});

$(".log-option-groups").click(()=>{
  $(".log-option-messages").removeClass("log-option-selected");
  $(".log-option-groups").addClass("log-option-selected");

  $(".chat-rooms").removeClass("section-focus");
  $(".chat-groups").addClass("section-focus");
});

export  function loadFriendChat(){
  manager.openChatBox();
  manager.closeLogs();
};

$(".nav-option-back").click(function(){
  manager.openLogs();
  manager.closeChatBox();
});
