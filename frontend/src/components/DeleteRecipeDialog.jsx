import React, {useState} from "react";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import {Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {deleteRecipe} from "../services/api";
import {describeResponseError} from "../services/errors";

/**
 * Asks before deleting a recipe, as it cannot be undone, then shows the list it is gone from.
 * A refusal is shown in the dialog, which stays open.
 */
export default function DeleteRecipeDialog({open, recipeId, recipeName, onClose}) {
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    const close = () => {
        setError(null);
        onClose();
    };

    const confirm = async () => {
        setDeleting(true);
        setError(null);
        try {
            await deleteRecipe(recipeId);
            onClose();
            navigate("/", {replace: true});
        } catch (failure) {
            setError(describeResponseError(failure));
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Dialog open={open} onClose={deleting ? undefined : close} aria-labelledby="delete-recipe-title">
            <DialogTitle id="delete-recipe-title">Delete recipe?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {recipeName ? <><strong>{recipeName}</strong> will</> : "The recipe will"} be deleted
                    with its ingredients, steps and picture. This cannot be undone.
                </DialogContentText>
                {error && <Alert severity="error" style={{marginTop: "10px"}}>{error}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={close} disabled={deleting}>Cancel</Button>
                <Button onClick={confirm} disabled={deleting} color="error" variant="contained">Delete</Button>
            </DialogActions>
        </Dialog>
    );
}

DeleteRecipeDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    recipeId: PropTypes.string.isRequired,
    recipeName: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};
