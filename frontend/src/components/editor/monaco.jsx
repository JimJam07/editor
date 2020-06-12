import React from "react";
import { ControlledEditor } from "@monaco-editor/react";
import SettingsIcon from "@material-ui/icons/Settings";
import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  icon: {
    height: 20,
    width: 20,
  },
}));
export default function MonacoEditor(props) {
  const classes = useStyles();
  return (
    <div id={props.id}>
      <div className="top-toolbar">
        {props.language}
        <IconButton className={classes.icon}>
          <SettingsIcon fontSize="small" color="secondary" />
        </IconButton>
      </div>
      <ControlledEditor
        height="30vh"
        width="40%"
        value={props.value}
        onChange={(ev, newCode) => {
          props.onChange(props.language, newCode);
        }}
        language={props.language}
        theme="dark"
      />
    </div>
  );
}
