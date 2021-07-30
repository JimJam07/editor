import React, { useState } from 'react';
import { ControlledEditor } from "@monaco-editor/react";

function Monaco({language,onChange,content}) {
    const [height,setHeight] = useState(30)
    const [width,setWidth] = useState(0)
    // console.log(language)
    return (
            <ControlledEditor
            height="30vh"
            width="40%"
            value={content}
            onChange={(e,newCode)=>{onChange(newCode,language);}}
            language={language}
            theme="dark"
            />
    )
}

export default Monaco;
