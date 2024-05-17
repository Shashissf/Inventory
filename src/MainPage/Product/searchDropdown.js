import React, { useState } from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const SearchDropdown = ({ options, onSelect, placeholder }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event, value) => {
    setInputValue(value);
  };

  const handleSelect = (event, value) => {
    onSelect(value);
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.title}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      placeholder={placeholder}
      renderInput={(params) => (
        <TextField {...params} label={placeholder} variant="outlined" />
      )}
    />
  );
};

SearchDropdown.propTypes = {
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.TextField,
};

export default SearchDropdown;
