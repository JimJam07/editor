const mongoose = require("mongoose")

const createRandomString = function (length, chars='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
const createNewEditor = function (socket,io,Code){
    const roomcode = createRandomString(6);
    var newroom = new Code({roomcode:roomcode,html:"",css:"",js:"",cdn:""});
    newroom.save((err,savedata)=>{
        if(err){console.log(error);}
        else{console.log(`created a room with code ${savedata.roomcode}`)}
    })
    socket.join(roomcode);
    io.to(roomcode).emit("createResponse",{error:false,code:roomcode})
}
const joinRoom = async function(socket,io,code,Code){
    console.log(code)
    try{
        let editorAccess = await Code.find({roomcode:code})
        console.log(editorAccess);
        socket.join(code);
        io.to(code).emit("joinedGame",editorAccess)
    }
    catch(err){
        console.log(err);
    }
}

const getCodeFromDB = function(socket,io,code,Code){
    Code.find({roomcode:code},(err,data)=>{
        if(err){console.log(err)}
        else{
        console.log(data);
        io.to(code).emit("setData",data)
        }
    })
}
const saveToMongo = async function(socket,io,code,Code){
    console.log("clear");
    console.log(code)
}

module.exports={
    createRandomString,
    createNewEditor,
    joinRoom,
    getCodeFromDB,
    saveToMongo
}