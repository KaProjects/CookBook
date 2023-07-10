import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router"
import axios from "axios"
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import {properties} from "../properties"
import Loader from "../components/Loader"
import AutoCompleteInput from "../components/AutoCompleteInput"
import {Button, Divider, IconButton, List, ListItem, TextField, Tooltip, Typography} from "@mui/material";
import {CheckBoxOutlineBlankOutlined, CheckBoxOutlined} from "@mui/icons-material";


export default function RecipeEditor(props) {
    const navigate = useNavigate()

    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(null)
    const [recipe, setRecipe] = useState({})
    const [categories, setCategories] = useState([])
    const [ingredients, setIngredients] = useState([])

    const fetchRecipe = async () => {
        axios.get("http://" + properties.host + ":" + properties.port + "/recipe/" + props.selectedRecipeId)
            .then((response) => {
                const recipe = response.data

                setRecipe(recipe)
                setRecipeName(recipe.name)
                setRecipeCategory(recipe.category)
                setRecipeIngredients(recipe.ingredients)
                setRecipeSteps(recipe.steps.sort((a,b) => a.number - b.number))
                if (recipe.image != null) {
                    setRecipeImage(recipe.image)
                }
                setRecipeValid(true)

                setError(null)
                setLoaded(true)
            })
            .catch((error) => {
                console.error(error)
                setError(error)
            })
    }

    const fetchAutocompleteOptions = async () => {
        axios.get("http://" + properties.host + ":" + properties.port + "/list/" + props.user + "/menu")
            .then((response) => {
                setCategories(response.data.categories)
                setIngredients(response.data.ingredients)
            })
            .catch((error) => {
                console.error(error)
                setError(error)
            })
    }

    useEffect(() => {
        fetchAutocompleteOptions()
        if (props.selectedRecipeId != null) {
            fetchRecipe()
        } else {
            recipe.name = null
            setRecipeName(recipe.name)
            recipe.category = null
            setRecipeCategory(recipe.category)
            recipe.ingredients = []
            setRecipeIngredients(recipe.ingredients)
            recipe.steps = []
            setRecipeSteps(recipe.steps)
            if (error === null) setLoaded(true)
        }
    }, [])

    const [recipeName, setRecipeName] = useState("")
    const [recipeCategory, setRecipeCategory] = useState("")
    const [recipeIngredients, setRecipeIngredients] = useState([])
    const [recipeSteps, setRecipeSteps] = useState([])
    const [recipeImage, setRecipeImage] = useState(null)

    const selectImageFile = (event) => {
        const file = event.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onloadend = function () {
            setRecipeImage(reader.result)
            recipe.image = reader.result
        }
    }

    const [recipeValid, setRecipeValid] = useState(false)

    function validateRecipe() {
        if (!validateRecipeName() || recipe.category == null || recipe.category === "") return false
        for (const ingredient of recipe.ingredients) {
            if (ingredient.name == null || ingredient.name === "" || ingredient.quantity == null || ingredient.quantity === "") return false
        }
        for (const step of recipe.steps) {
            if (step.text == null || step.text === "") return false
        }
        return true
    }

    function validateRecipeName() {
        return recipe.name != null && recipe.name !== ""
    }

    const postRecipe = async () => {
        setLoaded(false)
        if (recipe.id == null) {
            recipe.cook = props.user
            axios.post("http://" + properties.host + ":" + properties.port + "/recipe", recipe)
                .then((response) => {
                    redirectNewRecipe(response.data)
                })
                .catch((reason) => {
                    alert(reason)
                    setLoaded(true)
                })
        } else {
            axios.put("http://" + properties.host + ":" + properties.port + "/recipe", recipe)
                .then(() => {
                    redirectNewRecipe(recipe.id)
                })
                .catch((reason) => {
                    alert(reason)
                    setLoaded(true)
                })
        }
    }

    function redirectNewRecipe(id) {
        props.setSelectedRecipe(id)
        navigate("/recipe")
    }

    return (
        <>
            {!loaded &&
                <Loader error={error}/>
            }
            {loaded &&
                <div style={{maxWidth: "600px", marginRight: "auto", marginLeft: "auto"}}>

                    <TextField
                        label="Name" variant="outlined" component="h2"
                        value={recipeName}
                        onChange={(event) => {
                            setRecipeName(event.target.value)
                            recipe.name = event.target.value
                            setRecipeValid(validateRecipe)
                        }}
                        style={{margin: "15px 0 0 18px", width: "93%"}}
                        error={!validateRecipeName()}
                    />

                    <AutoCompleteInput
                        value={recipeCategory}
                        onInputChange={(category) => {
                            setRecipeCategory(category)
                            recipe.category = category
                            setRecipeValid(validateRecipe)
                        }}
                        options={categories}
                        style={{margin: "15px 0 0 25px", width: "91%"}}
                        name="Category"
                    />

                    <Typography style={{margin: "20px 0 0 25px", fontWeight: "bold"}}>Ingredients:</Typography>
                    <Divider style={{width: "91%", marginLeft: "25px", backgroundColor: "darkgrey"}}/>
                    {recipeIngredients.length > 0 &&
                        <List dense style={{width: "100%"}}>
                            {recipeIngredients.map((ingredient, index) => (
                                <ListItem component="div" key={index} style={{marginLeft: "15px", width: "95%"}}>

                                    <AutoCompleteInput
                                        value={ingredient.name}
                                        onInputChange={(name) => {
                                            const rIngredients = [...recipeIngredients]
                                            rIngredients[index].name = name
                                            setRecipeIngredients(rIngredients)
                                            recipe.ingredients = rIngredients
                                            if (name != null && !ingredients.includes(name)) {
                                                ingredients.push(name)
                                            }
                                            setRecipeValid(validateRecipe)
                                        }}
                                        options={ingredients}
                                        style={{marginBottom: "-4px", flex: "1"}}
                                        name="Name"
                                    />
                                    <TextField
                                        component="h2"
                                        label="Quantity"
                                        variant="standard"
                                        value={ingredient.quantity}
                                        onChange={(event) => {
                                            const rIngredients = [...recipeIngredients]
                                            rIngredients[index].quantity = event.target.value
                                            setRecipeIngredients(rIngredients)
                                            recipe.ingredients = rIngredients
                                            setRecipeValid(validateRecipe)
                                        }}
                                        style={{marginLeft: "10px", width: "90px"}}
                                        error={ingredient.quantity == null || ingredient.quantity === ""}
                                    />
                                    <IconButton
                                        color="inherit"
                                        aria-label="menu"
                                        onClick={() => {
                                            const rIngredients = [...recipeIngredients]
                                            rIngredients.at(index).optional = !rIngredients.at(index).optional
                                            setRecipeIngredients(rIngredients)
                                            recipe.ingredients = rIngredients
                                        }}
                                        style={{marginRight: "-10px"}}
                                    >
                                        <Tooltip title="unchecked is optional">
                                            {ingredient.optional ? <CheckBoxOutlineBlankOutlined/> :
                                                <CheckBoxOutlined/>}
                                        </Tooltip>
                                    </IconButton>
                                    <IconButton
                                        color="inherit"
                                        aria-label="menu"
                                        onClick={() => {
                                            const rIngredients = [...recipeIngredients]
                                            rIngredients.splice(index, 1)
                                            setRecipeIngredients(rIngredients)
                                            recipe.ingredients = rIngredients
                                            setRecipeValid(validateRecipe)
                                        }}
                                        style={{marginRight: "-10px"}}
                                    >
                                        <Tooltip title="delete this step">
                                            <DeleteIcon/>
                                        </Tooltip>
                                    </IconButton>
                                    <IconButton
                                        color="inherit"
                                        aria-label="menu"
                                        onClick={() => {
                                            const rIngredients = [...recipeIngredients]
                                            const ingredientToAdd = {name: null, quantity: "", optional: false}
                                            rIngredients.splice(index + 1, 0, ingredientToAdd)
                                            setRecipeIngredients(rIngredients)
                                            recipe.ingredients = rIngredients
                                            setRecipeValid(validateRecipe)
                                        }}
                                        style={{marginRight: "-15px"}}
                                    >
                                        <Tooltip title="add one step below">
                                            <AddCircleIcon/>
                                        </Tooltip>
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>}
                    {recipeIngredients.length === 0 &&
                        <IconButton
                            color="inherit"
                            aria-label="menu"
                            onClick={() => {
                                const rIngredients = [...recipeIngredients]
                                const ingredientToAdd = {name: null, quantity: "", optional: false}
                                rIngredients.push(ingredientToAdd)
                                setRecipeIngredients(rIngredients)
                                recipe.ingredients = rIngredients
                                setRecipeValid(validateRecipe)
                            }}
                            style={{margin: "0 0 0 30px"}}
                        >
                            <AddCircleIcon/>
                        </IconButton>
                    }

                    <Typography style={{margin: "10px 0 0 25px", fontWeight: "bold"}}>Steps:</Typography>
                    <Divider style={{width: "91%", marginLeft: "25px", backgroundColor: "darkgrey"}}/>
                    {recipeSteps.length > 0 &&
                        <List dense style={{width: "100%"}}>
                            {recipeSteps.map((step, index) => (
                                <ListItem component="div" key={index} style={{marginLeft: "15px", width: "95%"}}>

                                    <TextField
                                        component="h2"
                                        multiline
                                        maxRows={3}
                                        value={step.text}
                                        key={step.number}
                                        fullWidth
                                        onChange={(event) => {
                                            const steps = [...recipeSteps]
                                            steps[index].text = event.target.value
                                            setRecipeSteps(steps)
                                            recipe.steps = steps
                                            setRecipeValid(validateRecipe)
                                        }}
                                        error={step.text == null || step.text === ""}
                                    />
                                    <IconButton
                                        color="inherit"
                                        aria-label="menu"
                                        onClick={() => {
                                            const steps = [...recipeSteps]
                                            steps.at(index).optional = !steps.at(index).optional
                                            setRecipeSteps(steps)
                                            recipe.steps = steps
                                        }}
                                        style={{marginRight: "-10px"}}
                                    >
                                        <Tooltip title="unchecked is optional">
                                            {step.optional ? <CheckBoxOutlineBlankOutlined/> : <CheckBoxOutlined/>}
                                        </Tooltip>
                                    </IconButton>
                                    <IconButton
                                        color="inherit"
                                        aria-label="menu"
                                        onClick={() => {
                                            const steps = [...recipeSteps]
                                            steps.splice(index, 1)
                                            steps.map((step, index) => step.number = index + 1)
                                            setRecipeSteps(steps)
                                            recipe.steps = steps
                                            setRecipeValid(validateRecipe)
                                        }}
                                        style={{marginRight: "-10px"}}
                                    >
                                        <Tooltip title="delete this step">
                                            <DeleteIcon/>
                                        </Tooltip>
                                    </IconButton>
                                    <IconButton
                                        color="inherit"
                                        aria-label="menu"
                                        onClick={() => {
                                            const steps = [...recipeSteps]
                                            const stepToAdd = {number: -1, text: "", optional: false}
                                            steps.splice(index + 1, 0, stepToAdd)
                                            steps.map((step, index) => step.number = index + 1)
                                            setRecipeSteps(steps)
                                            recipe.steps = steps
                                            setRecipeValid(validateRecipe)
                                        }}
                                        style={{marginRight: "-15px"}}
                                    >
                                        <Tooltip title="add one step below">
                                            <AddCircleIcon/>
                                        </Tooltip>
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>}
                    {recipeSteps.length === 0 &&
                        <IconButton
                            color="inherit"
                            aria-label="menu"
                            onClick={() => {
                                const steps = [...recipeSteps]
                                const stepToAdd = {number: 1, text: "", optional: false}
                                steps.push(stepToAdd)
                                setRecipeSteps(steps)
                                recipe.steps = steps
                                setRecipeValid(validateRecipe)
                            }}
                            style={{margin: "0 0 0 30px"}}
                        >
                            <AddCircleIcon/>
                        </IconButton>
                    }

                    <Divider style={{width: "91%", marginLeft: "25px", backgroundColor: "darkgrey"}}/>
                    {recipeImage == null ?
                        <>
                            <input
                                type="file" name="file" accept="image/*"
                                onChange={selectImageFile}
                                style={{margin: "10px 0 0 30px", position: "absolute", left: "50%", transform: "translate(-50%, 0)"}}
                            />
                            <Divider style={{width: "91%", margin: "40px 0 0 25px", backgroundColor: "darkgrey"}}/>
                        </>
                        :
                        <>
                            <img src={recipeImage}
                                 alt="recipe"
                                style={{display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: "400px", maxHeight: "200px"}}
                            />
                            <IconButton
                                color="inherit"
                                aria-label="menu"
                                onClick={() => {
                                    setRecipeImage(null)
                                    recipe.image = null
                                }}
                                style={{float: "right", marginRight: "20px", marginBottom: "-50px", bottom: "50px"}}
                            >
                                <DeleteIcon/>
                            </IconButton>
                            <Divider style={{width: "91%", margin: "0 0 0 25px", backgroundColor: "darkgrey"}}/>
                        </>
                    }

                    <Button variant="contained"
                        disabled={!recipeValid}
                        onClick={() => postRecipe()}
                        style={recipeValid
                            ? {display: "block", margin: "10px auto 50px auto", backgroundColor: "rgb(1,121,1)", color: "white"}
                            : {display: "block", margin: "10px auto 50px auto", backgroundColor: "grey", color: "white"}}
                    >
                        {recipe.id == null ? "Create Recipe" : "Save Recipe"}
                    </Button>

                </div>
            }
        </>
    )
}