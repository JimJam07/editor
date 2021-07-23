const express = require("express");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const http = require("http");
const port = 5000;

const app = express();
const utils = require("./utils/utils")
const server = http.createServer(app);
const io = socketio(server,{
  cors: {
    origin: '*',
  }
});

// moongoose connection
mongoose.connect('mongodb://localhost:27017/editordb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const codeSchema = mongoose.Schema({
  roomcode:"",
  html:"",
  css:"",
  js:"",
  cdn:""
})

const Code = mongoose.model("editor",codeSchema)
let code;

io.on("connection", (socket) => {
  console.log("user is connected");
  socket.on("code-recieve", (code) => {
    console.log(code);
    Code.updateOne({roomcode:code.code},{$set:{html:code.html,css:code.css,js:code.javascript,cdn:code.cdn}})
    .then((err)=>{
        if(err){console.log(err);}
    });
    console.log("HBQ0fb"===code.code)
    socket.to(code.code).emit("code-send", code);
  });
  socket.on("newroom",()=>utils.createNewEditor(socket,io,Code))
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
  socket.on("joinGame",(code)=>{utils.joinRoom(socket,io,code,Code);})
  socket.on("getPrev",(code)=>utils.getCodeFromDB(socket,io,code,Code))
  socket.on("code-save",(code)=>utils.saveToMongo(socket,io,code,Code))
});

server.listen(port, () => console.log(`listening to port ${port}`));
