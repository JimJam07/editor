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
    cssCDN: "",
    jsCDN: "",
  };
  const [webCode, setWebCode] = useState({
    html: "",
    css: "",
    javascript: "",
    cssCDN: "",
    jsCDN: "",
  });
  const defaultStyles =
    "<style>body{background-color:#333;}p{text-align: center;color:white;}</style><p>pls type your code <3</p>";
  const ENDPOINT = "http://localhost:5000/";
  useEffect(() => {
    socket = io(ENDPOINT);
    console.log(socket);
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("code-send", (code) => {
      updateFrame(code);
    });
  }, [value]);
  function updateFrame(newCode) {
    const code = newCode;
    var css = "<style>" + newCode.css + "</style>";
    var js = "<script>" + newCode.javascript + "</script>";
    var net = newCode.html + css + js;
    setValue(net);
    setWebCode((prevValue) => {
      return {
        ...prevValue,
        html: code.html,
        css: code.css,
        javascript: code.javascript,
      };
    });
  }

  function handleEditorChange(lang, newCode) {
    codeSplit = {
      ...codeSplit,
      [lang]: newCode,
    };
    updateFrame(codeSplit);
    socket.emit("code-recieve", { ...codeSplit });
  }
  function emptyValueChecker() {
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
