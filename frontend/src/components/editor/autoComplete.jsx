import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

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
  var cdnPush = [];
  var [cdnArray, setCdn] = useState([]);
  const [value, setValue] = React.useState(null);

  function handleDelete(el) {
    setCdn((prevCdn) => {
      return prevCdn.filter((word) => word !== el);
    });
    cdnPush.filter((words) => `${words.title}-${words.version}` !== el);
    props.CDN(cdnPush);
  }

  return (
    <div>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          console.log(props);
          if (newValue != null) {
            cdnPush.push(newValue);
            props.CDN(cdnPush);
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
        options={top100Films}
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

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  {
    title: "bootstrap",
    cdn: `
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>`,
    version: "4.5.0",
  },
  {
    title: "jQuery",
    cdn: `<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>`,
    version: "3.5.1",
  },
];
