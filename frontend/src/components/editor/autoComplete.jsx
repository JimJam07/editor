import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import cdnVersion from "./cdn";

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function FreeSoloCreateOption(props) {
  const classes = useStyles();
  var cdnPush = props.autoCDN;
  var dummy = [];
  console.log(props);
  props.autoCDN.map((newValue) => {
    dummy.push(`${newValue.title}-${newValue.version}`);
  }); // a variable which recievs the active values of cdn from editor
  var [cdnArray, setCdn] = useState(dummy); // a state that tracks the cdn name version
  const [value, setValue] = React.useState(null); // for autocomplete value

  function handleDelete(el) {
    setCdn((prevCdn) => {
      return prevCdn.filter((word) => word !== el);
    });
    cdnPush = cdnPush.filter(
      (words) => `${words.title}-${words.version}` !== el
    );
    props.CDN(cdnPush, props.code, "delete");
  }

  return (
    <div>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          event.preventDefault();
          if (newValue != null) {
            cdnPush.push(newValue);
            props.CDN(cdnPush, props.code);
            setCdn((prevState) => [
              ...prevState,
              `${newValue.title}-${newValue.version}`,
            ]);
          }

          if (typeof newValue === "string") {
            setValue({
              title: newValue,
            });
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            setValue({
              title: newValue.inputValue,
            });
          } else {
            setValue(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          // Suggest the creation of a new value
          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              title: `Add "${params.inputValue}"`,
            });
          }
          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="free-solo-with-text-demo"
        options={cdnVersion}
        getOptionDisabled={(option) =>
          cdnArray.includes(`${option.title}-${option.version}`, 0)
        }
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.title + "-" + option.version;
        }}
        renderOption={(option) => option.title + "-" + option.version}
        style={{ width: 300 }}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add external CDN's"
            variant="outlined"
            className="text-field"
          />
        )}
      />
      <div className={classes.root}>
        {cdnArray.map((element, index) => {
          return (
            <Chip
              key={index.toString()}
              size="small"
              label={element}
              color={Math.random() < 0.5 ? "primary" : "secondary"}
              variant="outlined"
              onDelete={() => {
                handleDelete(element);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
