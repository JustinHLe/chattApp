const express = require("express"); //import express module
var path = require("path");
const app = express(); // instantiate a new express object called app
/*
    similar to creating an object from a class, in our case express is a class 
    and we instantiate an object from the express class called app
*/
const http = require("http"); // import http module
const server = http.createServer(app);
/*
    http module allows node js to transfer data with http
    http createServer method creates a server object that can listen to ports and execute a function each time 
    a request is made to the server

    http.createServer takes a parameter which is a function that is called every time the server has a request
*/
const { Server } = require("socket.io");
const io = new Server(server); // hook up socket.io to the http server
app.use(express.static("public")); //app middleware serves all files/dir from public dir will run before any actions occur
/*
 able to view styles.css from localhost:3000/styles.css
 express.static is a function which will expose a directory to a URL so the content in the directory can be accesible
*/
var userArr = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname  + "/index.html");
});

io.on("connection", (socket) => {
  console.log("user is connected", socket.id);
  var user;
  console.log(userArr)
  socket.on("disconnect", () => {
    if (user != undefined) {
      if (user === socket.id) {
        io.emit("user disconnect", user.substring(user.length - 4));
      } else {
        io.emit("user disconnect", user);
      }
    }
    var userIndex = userArr.indexOf(socket.id)
    if(userIndex !== -1){
      userArr.splice(userIndex, 1)
    }

    if(userArr.length === 0){
      io.emit("clear chat history")
    }
  });

  socket.on("user entered", (usr) => {
    if (usr.includes("Guest")) {
      user = socket.id;
      io.emit("username", {
        username: "Guest " + socket.id.substring(socket.id.length - 4),
        id: socket.id,
      });
    } else {
      user = usr;
      io.emit("username", { username: usr, id: socket.id });
    }
    userArr.push(socket.id)
    console.log(userArr)
  }); 

  socket.on("req chat message", (req) => {
    console.log("request message", req);
    io.emit("res chat message", { value: req, id: socket.id, username: user.substring(user.length - 4) });
    socket.broadcast.emit("user stopped typing");
  });

  socket.on("user typing", (id) => {
    socket.broadcast.emit("user typing", user.substring(user.length - 4));
  });

  socket.on("user stopped typing", () => {
    socket.broadcast.emit("user stopped typing");
  });
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
