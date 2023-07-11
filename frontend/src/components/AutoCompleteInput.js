import React from 'react'
import {Autocomplete, TextField, Typography} from "@mui/material"
import { createFilterOptions } from '@mui/material/Autocomplete'
import PropTypes from "prop-types"

const filter = createFilterOptions()

export default function AutoCompleteInput({value, onInputChange, options, style, name}) {

    const optionStyle = {width: "600px", margin: "0px 0px 1px 0px", boxShadow: "0 0 1px 0", backgroundColor: "rgb(255,255,255)"}

    return (
        <Autocomplete
            value={value}
            onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                    onInputChange(newValue)
                } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    onInputChange(newValue.inputValue)
                } else {
                    onInputChange(newValue)
                }
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params)

                const { inputValue } = params
                // Suggest the creation of a new value
                const isExisting = options.some((option) => inputValue === option)
                if (inputValue !== '' && !isExisting) {
                    filtered.push({
                        inputValue,
                        title: `Add "${inputValue}"`,
                    })
                }

                return filtered
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={options}
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                    return option
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return option.inputValue
                }
                // Regular option
                return option.title
            }}
            renderOption={(props, option) => <Typography {...props} style={optionStyle}>{option.title === undefined ? option : option.title}</Typography>}
            freeSolo
            renderInput={(params) => <TextField {...params} component="div" label={name} error={!value} variant="standard"/>}
            style={style}
        />
    )
}
AutoCompleteInput.propTypes = {
    value: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired
}