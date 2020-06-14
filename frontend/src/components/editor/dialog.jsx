import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme, withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton, Divider } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

import AutoComplete from "./autoComplete";

export default function ResponsiveDialog(props) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // close button styles
  const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });
  // for rendering close button
  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="customized-dialog-title"
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={props.handleClose}
          className="dialog"
        >
          Settings
        </DialogTitle>
        <Divider />
        <DialogContent className="dialog">
          <h2>import external cdns</h2>
          <AutoComplete
            CDN={props.CDN}
            autoCDN={props.autoCDN}
            code={props.code}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
