const express = require("express");
const socketio = require("socket.io");
const bodyParser = require("body-parser");

const http = require("http");
const port = 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);
let code;
io.on("connection", (socket) => {
  console.log("user is connected");
  socket.on("code-recieve", (code) => {
    console.log(code);
    socket.broadcast.emit("code-send", code);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

server.listen(port, () => console.log(`listening to port ${port}`));
