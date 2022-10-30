var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
var nameInput = document.getElementById("name-input");
var enterChat = document.getElementById("enter");
var modal = document.getElementsByClassName("modal-bg");
var socket = io();

enterChat.addEventListener("submit", (e) => {
  e.preventDefault();
  if (nameInput.value) {
    socket.emit("user entered", nameInput.value);
    nameInput.value = "";
  } else {
    socket.emit("user entered", `Guest ${socket.id}`);
  }
  modal[0].style.display = "none";

  socket.on("username", (usr) => {
    var item = document.createElement("li");
    item.textContent = `Welcome ${usr.username}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("req chat message", input.value);
    input.value = "";
  }
});

socket.on("res chat message", (msg) => {
  console.log(socket.id, msg.id);
  //   var item = document.createElement("li");
  //   item.textContent = msg;
  //   messages.appendChild(item);
  //   window.scrollTo(0, document.body.scrollHeight);
});
