import React, { useState,useEffect } from 'react'
import {TextField,Button} from '@material-ui/core'
import io from 'socket.io-client'
import './home.css';
import { Redirect } from 'react-router-dom';
function Home({socket}) {
    const [code,setCode] = useState("");
    const [redirect,setRedirect] = useState({redirect:false,url:""})
    const [err,setErr] = useState(false)
    useEffect(()=>{
      socket.on("createResponse",data=>{
          console.log(data)
        if(!data.error){
          setRedirect({
             redirect:true,
             url:`/play/${data.code}`
          });
        }else{
          console.log(data.msg);
        }
      });

      socket.on("joinedGame",data=>{
        console.log(data)
      if(!data.error){
        setRedirect({
           redirect:true,
           url:`/play/${data[0].roomcode}`
        });
      }else{
        console.log(data.msg);
      }
    });
    })
  console.log(redirect)
    // create new room
    function createNewRoom(){
        console.log("hi")
        socket.emit("newroom");
    }
  
    // search for existing room
    function searchRoom(){
        (code=="")?setErr(true):setErr(false);
        if(code){
            console.log(code)
            socket.emit("joinGame",code)
        }
    }
    return (
     redirect.redirect?(<Redirect to ={redirect.url}/>):(
            <div className="home">
            <div className="home__login">
                <h1>already have a code?</h1>
            <TextField 
            required id="standard-required" 
            label="editor code" 
            placeholder="name" 
            onChange={(e)=>{setCode(e.target.value)}}
            error = {err}
            helperText={err&&"Enter Valid Code"}
            />
                <br /><br />
            <Button variant="outlined" color="primary" onClick={searchRoom}>Join Room</Button>
            <br /><br />
            <hr className="hr-text" data-content="OR"/>
            <h1>want a new editor?</h1>
            <Button variant="outlined" color="secondary" onClick={createNewRoom}>
              get a editor code
            </Button>
            </div>   
        </div>
     )
    )
}

export default Home

