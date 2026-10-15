import React from "react";
import PropTypes from "prop-types";
import {IconButton, Tooltip} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import {CheckBoxOutlineBlankOutlined, CheckBoxOutlined} from "@mui/icons-material";

/**
 * The buttons at the end of an ingredient or step row: whether it is required, delete it, and add
 * another below it. Each says what it does, with the row it belongs to, to a screen reader.
 */
export default function RowActions({what, optional, onToggleOptional, onRemove, onAddBelow}) {
    return (
        <>
            <Tooltip title={optional ? "Optional - click to make required" : "Required - click to make optional"}>
                <IconButton size="small" color="inherit" aria-label={`${what} is ${optional ? "optional" : "required"}`}
                            aria-pressed={!optional} onClick={onToggleOptional}>
                    {optional ? <CheckBoxOutlineBlankOutlined/> : <CheckBoxOutlined/>}
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
                <IconButton size="small" color="inherit" aria-label={`Delete ${what}`} onClick={onRemove}>
                    <DeleteIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Add one below">
                <IconButton size="small" color="inherit" aria-label={`Add below ${what}`} onClick={onAddBelow}>
                    <AddCircleIcon/>
                </IconButton>
            </Tooltip>
        </>
    );
}

RowActions.propTypes = {
    what: PropTypes.string.isRequired,
    optional: PropTypes.bool.isRequired,
    onToggleOptional: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onAddBelow: PropTypes.func.isRequired,
};
