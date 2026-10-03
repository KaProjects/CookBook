import React from "react";
import PropTypes from "prop-types";
import {List, ListItem, TextField} from "@mui/material";
import AutoCompleteInput from "../AutoCompleteInput";
import AddRowButton from "./AddRowButton";
import RowActions from "./RowActions";
import {LIMITS} from "../../services/recipeForm";

/** The ingredients, each named from the ones already in use or a new one. */
export default function IngredientRows({ingredients, options, dispatch}) {
    if (ingredients.length === 0) {
        return <AddRowButton label="Add ingredient" onClick={() => dispatch({type: "addIngredient", after: -1})}/>;
    }
    return (
        <List dense aria-label="Ingredients">
            {ingredients.map((ingredient, index) => {
                const what = `ingredient ${index + 1}`;
                const change = (changes) => dispatch({type: "changeIngredient", index, changes});
                return (
                    <ListItem key={ingredient.key} component="div" style={{gap: "10px"}}>
                        <AutoCompleteInput value={ingredient.name} onChange={(name) => change({name})}
                                           options={options} label={`Ingredient ${index + 1}`}
                                           maxLength={LIMITS.ingredientName} style={{flex: 1}}/>
                        <TextField label="Quantity" variant="standard" value={ingredient.quantity}
                                   onChange={(event) => change({quantity: event.target.value})}
                                   slotProps={{htmlInput: {maxLength: LIMITS.quantity, "aria-label": `Quantity of ${what}`}}}
                                   style={{width: "90px"}}/>
                        <RowActions what={what} optional={ingredient.optional}
                                    onToggleOptional={() => change({optional: !ingredient.optional})}
                                    onRemove={() => dispatch({type: "removeIngredient", index})}
                                    onAddBelow={() => dispatch({type: "addIngredient", after: index})}/>
                    </ListItem>
                );
            })}
        </List>
    );
}

IngredientRows.propTypes = {
    ingredients: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
        optional: PropTypes.bool.isRequired,
    })).isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    dispatch: PropTypes.func.isRequired,
};
