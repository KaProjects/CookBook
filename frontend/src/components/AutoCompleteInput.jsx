import React from "react";
import PropTypes from "prop-types";
import {Autocomplete, TextField} from "@mui/material";
import {createFilterOptions} from "@mui/material/Autocomplete";

const filter = createFilterOptions();

/**
 * A text field that suggests the values already in use, and takes a new one as well: typing
 * something that is not among them offers to add it.
 */
export default function AutoCompleteInput({value, onChange, options, label, maxLength, style}) {
    return (
        <Autocomplete
            value={value}
            onChange={(event, selected) => {
                if (selected && typeof selected === "object") onChange(selected.inputValue);
                else onChange(selected ?? "");
            }}
            filterOptions={(available, params) => {
                const filtered = filter(available, params);
                const {inputValue} = params;
                if (inputValue !== "" && !available.includes(inputValue)) {
                    filtered.push({inputValue, title: `Add "${inputValue}"`});
                }
                return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            freeSolo
            options={options}
            getOptionLabel={(option) => (typeof option === "string" ? option : option.inputValue)}
            renderOption={({key, ...props}, option) => (
                <li key={key} {...props}>{typeof option === "string" ? option : option.title}</li>
            )}
            renderInput={(params) => (
                <TextField {...params} label={label} variant="standard" error={!value}
                           slotProps={{htmlInput: {...params.inputProps, maxLength}}}/>
            )}
            style={style}
        />
    );
}

AutoCompleteInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.string.isRequired,
    maxLength: PropTypes.number,
    style: PropTypes.object,
};
