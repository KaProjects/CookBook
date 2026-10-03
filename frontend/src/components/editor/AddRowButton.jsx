import React from "react";
import PropTypes from "prop-types";
import {Button} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

/** Adds the first row of a list that has none. */
export default function AddRowButton({label, onClick}) {
    return (
        <Button color="inherit" startIcon={<AddCircleIcon/>} onClick={onClick} style={{marginLeft: "20px"}}>
            {label}
        </Button>
    );
}

AddRowButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};
