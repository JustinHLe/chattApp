var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
var nameInput = document.getElementById("name-input");
var typingContainer = document.getElementsByClassName("typingContainer")[0];
var enterChat = document.getElementById("enter");
var modal = document.getElementsByClassName("modal-bg");
var socket = io();
var timeout;

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
    item.style.background = "#efefef";
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("req chat message", input.value);
    input.value = "";
  }
});

input.addEventListener("input", (e) => {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    socket.emit("user stopped typing");
  }, 3000);
  socket.emit("user typing", socket.id);
});

socket.on("user disconnect", (user) => {
  if (window.getComputedStyle(modal[0]).display === "flex") {
    return;
  }
  var item = document.createElement("li");
  item.textContent = `${user} disconnected :(`;
  item.style.background = "#efefef";
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

socket.on("user stopped typing", () => {
  typingContainer.style.display = "none";
});

socket.on("user typing", (user) => {
  typingContainer.style.display = "flex";
  typingContainer.textContent = user + " is typing...";
});

socket.on("res chat message", (msg) => {
  console.log(msg.username);
  if (socket.id === msg.id) {
    var item = document.createElement("li");
    var author = document.createElement("h4");
    var content = document.createElement("p");

    author.textContent = msg.username;
    content.textContent = msg.value;

    item.appendChild(author);
    item.appendChild(content);

    author.style.margin = "0";
    content.style.margin = "8px 0";
    item.style.display = "flex";
    item.style.flexDirection = "column";
    item.style.float = "left";
    item.style.background = "#1982FC";
    item.style.margin = "12px";
    item.style.borderRadius = "8px";

    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  } else {
    var item = document.createElement("li");
    var author = document.createElement("h4");
    var content = document.createElement("p");

    author.textContent = msg.username;
    content.textContent = msg.value;

    item.appendChild(author);
    item.appendChild(content);

    author.style.margin = "0";
    content.style.margin = "8px 0";
    item.style.float = "right";
    item.style.background = "#efefef";
    item.style.margin = "12px";
    item.style.borderRadius = "8px";
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  }
});
