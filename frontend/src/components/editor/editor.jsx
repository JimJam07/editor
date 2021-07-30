import React,{useEffect, useState,useReducer} from 'react'
import {useParams} from 'react-router-dom'
import Monaco from './monaco/monaco';
import './editor.css'
import CDN from '../cdn/cdn';

const webInitial = {
    html:"",
    css:"",
    javascript:"",
    cdn:"",
};
const reducer = (state,action)=>{
    console.log(action)
        let temp = state;
        temp[action.language]=action.code;
    return temp;
}

function Editor() {
    const [web,dispatch] = useReducer(reducer,webInitial);
    const [cdn,setCdn] = useState([])
    let cdnStr = "";
    const [iframeCode, SetIframeCode] = useState("");
    // const {code} = useParams();
    let languages = ["html", "css", "javascript"];
    // console.log(code)

    // useEffect(()=>{
    //     const timer = setInterval(() => {
    //         changeFrameCode();
    //       }, 5000);
    //     //   return () => clearInterval(timer);
    // },[])

    // controls changes in CDN
    const changeCdn = async (cd)=>{

        cdnStr="";
        let temp = [...cd]
        setCdn(temp);
        cdn.map((ele)=>{
            cdnStr+=`<script src="${ele.latest}"></script>`
        })
        console.log(cdnStr)
        await dispatch({language:"cdn",code:cdnStr})
        changeFrameCode();
    }

    // function to control editor changes
    const codeChange = function(change,language){
        dispatch({language:language,code:change});
        changeFrameCode();
    }

    const changeFrameCode = function(){
        console.log(web)
        let frame = web.cdn+web.html +"<style>"+web.css+"</style>"+"<script>"+web.javascript+"</script>";
        SetIframeCode(frame);
    }

    return (
        <div className="editor">
            {languages.map((ele,index)=>{
                return(
                    <div className="monaco" key={index}>
                    <div className="toolbar">
                    <p>{ele}</p>
                    <CDN changeCdn={changeCdn}  cd={cdn}/>
                    </div>
                    <div className="monaco__editor">
                    <Monaco
                    key={index}
                    language={ele}
                    onChange={codeChange}
                    content = {web[ele]}
                    />
                    </div>
                    </div>

                )
            })}

            <iframe srcDoc={iframeCode} frameBorder="0"></iframe>
        </div>
    )
}

export default Editor