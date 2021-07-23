import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import {useParams} from 'react-router-dom'
import MonacoEditor from "./monaco";
import "./styles.css";

let socket;
export default function Editor({socket}) {
  const {code} = useParams()
  ///              variable & constant declaration section
  var [autoCDN, setAuto] = useState([]);
  const languages = ["html", "css", "javascript"];
  const [value, setValue] = useState("");
  var codeSplit = {
    html: "",
    css: "",
    javascript: "",
    cdn: "",
  }; // for tracking changes in each field
  const [webCode, setWebCode] = useState({
    html: "",
    css: "",
    javascript: "",
  });
  useEffect(()=>{
    socket.emit("getPrev",code);
    socket.on("setData",(data)=>{
      console.log(data);
      setWebCode((prevCode)=>{
        return {
          html:data[0].html,
          css:data[0].css,
          javascript:data[0].js
        }
      })
      codeSplit = {
        html:data[0].html,
        css:data[0].css,
        javascript:data[0].js,
        cdn:data[0].cdn
      }
      updateFrame(codeSplit)
    })
  },[])
  // const [cdnPush,setCdn] = useState([])
  const defaultStyles =
    "<style>body{background-color:#333;}p{text-align: center;color:white;}</style><p>pls type your code <3</p>"; //default styles iframe
  //activate when change in monaco or in the autocomplete
  useEffect(() => {
    socket.on("code-send", (code) => {
      code.autoCDN != undefined ? setAuto(code.autoCDN) : setAuto([]);
      codeSplit = {
        html: code.html,
        css: code.css,
        javascript: code.javascript,
        cdn: code.cdn,
      };
      updateFrame(codeSplit);

    });
  }, [value]);

  // for updating code in Iframe
  function updateFrame(newCode) {
    // const code = newCode;
    console.log(newCode.cdn)
    var css = "<style>" + newCode.css + "</style>";
    var js = "<script type='text/babel'>" + newCode.javascript + "</script>";
    var net = newCode.cdn + newCode.html + css + js;
    setValue(net);
    setWebCode((prevValue) => {
      return {
        ...prevValue,
        html: newCode.html,
        css: newCode.css,
        javascript: newCode.javascript,
      };
    });
  }
  // fires when a cdn is selected
  function CDN(cdn, code, requestType) {
    if (requestType === "add") {
      setAuto((prevValue) => {
        return [...prevValue, code];
      });
    }
    if (requestType === "delete") {
      setAuto([...cdn]);
    }
    let cdns = "";
    cdn.forEach((el) => {
      cdns += "<!--" + el.title + "-->" + el.cdn;
    });
    codeSplit = {
      ...code,
      cdn: cdns,
    };
    console.log({ ...codeSplit, ...autoCDN,code:code });
    updateFrame(codeSplit);
    socket.emit("code-recieve", { ...codeSplit, ...autoCDN,code:code });
  }
  // to handle change in  monaco Editor and for live editing
  function handleEditorChange(lang, newCode) {
    codeSplit = {
      ...codeSplit,
      [lang]: newCode,
    };
    updateFrame(codeSplit);
    socket.emit("code-recieve", { ...codeSplit, ...autoCDN,code:code });
    console.log(autoCDN)
  }
  // to check if value is empty and return styles
  function emptyValueChecker() {
    return value === "" ? defaultStyles : value;
  }
  function saveCode(){
    console.log(codeSplit);
    console.log(autoCDN)
    // socket.emit("code-save", { ...codeSplit, ...autoCDN, code:code });
  }
  return (
    <div>
      {languages.map((language, index) => {
        return (
          <MonacoEditor
            key={index}
            id={index}
            language={language}
            value={webCode[[language]]}
            onChange={handleEditorChange}
            CDN={CDN}
            autoCDN={autoCDN}
            code={webCode}
          />
        );
      })}
      <iframe
        srcDoc={emptyValueChecker()}
        title="compiler"
        frameBorder="0"
      ></iframe>
    </div>
  );
}
