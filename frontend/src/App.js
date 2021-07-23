import React,{useEffect,useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter
} from "react-router-dom";
import Editor from './components/editor/editor'
import Home from './components/home/home'
import io from 'socket.io-client'


const ENDPOINT = "http://localhost:5000/";
const socket = io(ENDPOINT);

export default function App(){
  return (
        <div className="App">
      <BrowserRouter>
      <Switch>
          <Route exact path="/play/:code" component={()=> <Editor socket={socket} />}/>
          <Route path="/">
            <Home socket={socket}  />
          </Route>
        </Switch>
      </BrowserRouter>

    </div>
  )
}
