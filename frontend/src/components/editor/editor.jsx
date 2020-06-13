import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import MonacoEditor from "./monaco";
import "./styles.css";

let socket;
export default function Editor() {
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
  const defaultStyles =
    "<style>body{background-color:#333;}p{text-align: center;color:white;}</style><p>pls type your code <3</p>"; //default styles iframe
  const ENDPOINT = "http://localhost:5000/";
  // useEffect(() => {
  //   socket = io(ENDPOINT);
  //   console.log(socket);
  // }, [ENDPOINT]);
  // //activate when change in monaco
  // useEffect(() => {
  //   socket.on("code-send", (code) => {
  //     updateFrame(code);
  //   });
  //}, [value]);
  // for updating code in Iframe
  function updateFrame(newCode) {
    // const code = newCode;
    var css = "<style>" + newCode.css + "</style>";
    var js = "<script>" + newCode.javascript + "</script>";
    var net = newCode.html + css + js + newCode.cdn;
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
  function CDN(cdn) {
    if (cdn != null) {
      var cdns = "<!--" + cdn.title + "-->" + cdn.cdn;
      codeSplit = {
        ...codeSplit,
        cdn: cdns,
      };
    }
  }
  // to handle change in  monaco Editor and for live editing
  function handleEditorChange(lang, newCode) {
    codeSplit = {
      ...codeSplit,
      [lang]: newCode,
    };
    updateFrame(codeSplit);
    // socket.emit("code-recieve", { ...codeSplit });
  }
  // to check if value is empty and return styles
  function emptyValueChecker() {
    console.log(value);
    return value === "" ? defaultStyles : value;
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
