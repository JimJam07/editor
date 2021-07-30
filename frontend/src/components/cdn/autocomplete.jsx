import React, { useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import algoliaSearch from 'algoliasearch';
import axios from 'axios'
import Chip from "@material-ui/core/Chip";
import { useState } from "react";
import './autocomplete.css'
import {AiOutlineStar,AiOutlineEye} from 'react-icons/ai'


export default function FreeSoloCreateOption({changeCdn,cd}) {
    const [cdn,setCDN] = useState([])
    const [cdnChip,setCdnChip] = useState(cd)
  useEffect(()=>{
    (async () => {
        await axios.get("https://api.cdnjs.com/libraries?fields=filename,description,version,github,sri&limit=4500")
        .then((data)=>{
            setCDN([...data.data.results]);
        })
      })()

  },[])


  // to change cdn
  const handleDelete = (ele)=>{
    let val = cdnChip.filter((el)=> el.name!=ele.name);
    changeCdn(val)
    setCdnChip(val)
  }
  return (
<div id="autocomplete" className="autocomplete">
  <p>Search over 3500+ libraries from CDNJS</p>
  {/* autocomplete */}
<Autocomplete
  id="combo-box-demo"
  onChange={(e,val)=>{
    e.preventDefault();
    if(val!=null){
      let value = val;
      value.latest = `https://cdn.jsdelivr.net/npm/${value.name}`
      let temp=[...cdnChip,value]
      setCdnChip(temp)
      changeCdn(temp)
   }
  }}
  options={cdn}
  selectOnFocus
   clearOnBlur
  handleHomeEndKeys
  getOptionLabel={(option) => option.name}
  style={{ width: 300 }}
  renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
  renderOption={(options)=>{
    return(
      <div className="">
      <h3>{options.name}-{options.version}</h3>    
      <span className="forks"><i className="fa fa-code-fork" aria-hidden="true"></i>  {options.github?.forks}   <AiOutlineStar/>{options.github?.stargazers_count} <AiOutlineEye/>{options.github?.subscribers_count}</span>
      <p>{options.description}</p>
      </div>
    )
  }}
/>

{cdnChip.map((ele,index)=>{
  return   <Chip
            key={index}
            label={`${ele.name}-${ele.version}`}
            onDelete={()=>{
              handleDelete(ele)
            }}
            color="secondary"
          />
})}
</div>
  );
}
