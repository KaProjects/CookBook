import React from "react";
import PropTypes from "prop-types";
import {List, ListItem, TextField} from "@mui/material";
import AddRowButton from "./AddRowButton";
import RowActions from "./RowActions";
import {LIMITS} from "../../services/recipeForm";

/** The steps, numbered in the order they are listed. */
export default function StepRows({steps, errors, dispatch}) {
    if (steps.length === 0) {
        return <AddRowButton label="Add step" onClick={() => dispatch({type: "addStep", after: -1})}/>;
    }
    return (
        <List dense aria-label="Steps">
            {steps.map((step, index) => (
                <ListItem key={step.key} component="div" style={{gap: "10px"}}>
                    <TextField label={`Step ${index + 1}`} variant="standard" multiline maxRows={5} fullWidth
                               value={step.text} error={errors[index]}
                               onChange={(event) => dispatch({type: "changeStep", index, changes: {text: event.target.value}})}
                               slotProps={{htmlInput: {maxLength: LIMITS.step}}}/>
                    <RowActions what={`step ${index + 1}`} optional={step.optional}
                                onToggleOptional={() => dispatch({type: "changeStep", index, changes: {optional: !step.optional}})}
                                onRemove={() => dispatch({type: "removeStep", index})}
                                onAddBelow={() => dispatch({type: "addStep", after: index})}/>
                </ListItem>
            ))}
        </List>
    );
}

StepRows.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        optional: PropTypes.bool.isRequired,
    })).isRequired,
    errors: PropTypes.arrayOf(PropTypes.bool).isRequired,
    dispatch: PropTypes.func.isRequired,
};
