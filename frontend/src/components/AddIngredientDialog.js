import React, {useState} from 'react'
import PropTypes from "prop-types"
import {Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel} from "@mui/material"
import {Button, TextField} from "@material-ui/core"
import AutoCompleteInput from "./AutoCompleteInput"


export default function AddIngredientDialog({open, setOpen, addIngredient, ingredients}) {

    const [name, setName] = useState("")
    const [quantity, setQuantity] = useState("")
    const [optional, setOptional] = useState(false)
    const [valid, setValid] = useState(false)

    const handleClose = () => {
        setName("")
        setQuantity("")
        setOptional(false)
        setValid(false)
        setOpen(false)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        addIngredient({name: name, quantity: quantity, optional: optional})
        setName("")
        handleClose()
    }

    function validate(name, quantity){
        setValid(name != null && name !== "" && quantity != null && quantity !== "")
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Add Ingredient</DialogTitle>
                <DialogContent>
                    <AutoCompleteInput value={name}
                                       onInputChange={(name) => {
                                           setName(name)
                                           validate(name, quantity)
                                       }}
                                       options={ingredients}
                                       name="Ingredient"
                    />
                    <TextField label="Quantity" component="h2"
                               value={quantity}
                               onChange={(event) => {
                                   setQuantity(event.target.value)
                                   validate(name, event.target.value)
                               }}
                    />
                    <br/>
                    <FormControlLabel
                        control={<Checkbox
                            checked={!optional}
                            onChange={(event, checked) => setOptional(!checked)}
                            inputProps={{'aria-label': 'controlled'}}/>}
                        label="Mandatory"
                    />


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={!valid} type="submit">Add</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
AddIngredientDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    addIngredient: PropTypes.func.isRequired,
    ingredients: PropTypes.array.isRequired,
}