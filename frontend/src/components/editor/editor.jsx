import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import MonacoEditor from "./monaco";
import "./styles.css";

let socket;
export default function Editor() {
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
  // const [cdnPush,setCdn] = useState([])
  const defaultStyles =
    "<style>body{background-color:#333;}p{text-align: center;color:white;}</style><p>pls type your code <3</p>"; //default styles iframe
  const ENDPOINT = "http://localhost:5000/";
  //      variable declaration ends

  useEffect(() => {
    socket = io(ENDPOINT);
    console.log(socket);
  }, [ENDPOINT]);
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
    var css = "<style>" + newCode.css + "</style>";
    var js = "<script>" + newCode.javascript + "</script>";
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
    // console.log(codeSplit.cdn);
    updateFrame(codeSplit);
    socket.emit("code-recieve", { ...codeSplit, ...autoCDN });
  }
  // to handle change in  monaco Editor and for live editing
  function handleEditorChange(lang, newCode) {
    codeSplit = {
      ...codeSplit,
      [lang]: newCode,
    };
    updateFrame(codeSplit);
    socket.emit("code-recieve", { ...codeSplit, ...autoCDN });
  }
  // to check if value is empty and return styles
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
