import React from "react";
import { ControlledEditor } from "@monaco-editor/react";
import Setting from "./dialog";
import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  settings: {
    height: 20,
    width: 20,
  },
  close: {
    textAlign: "right",
  },
}));

export default function MonacoEditor(props) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
    console.log(props);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div id={props.id}>
      <div className="top-toolbar">
        {props.language}
        <IconButton className={classes.settings}>
          <SettingsIcon
            onClick={handleClickOpen}
            color="secondary"
            fontSize="small"
          />
        </IconButton>
        <Setting
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
          open={open}
          CDN={props.CDN}
          autoCDN={props.autoCDN}
          code={props.code}
        />
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
