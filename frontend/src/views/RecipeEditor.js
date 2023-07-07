import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router"
import axios from "axios"
import {
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core"
import DiamondIcon from "@mui/icons-material/Diamond"
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation"
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import {properties} from "../properties"
import Loader from "../components/Loader"
import AutoCompleteInput from "../components/AutoCompleteInput"
import {CheckBoxOutlineBlankOutlined, CheckBoxOutlined} from "@material-ui/icons"
import AddIngredientDialog from "../components/AddIngredientDialog"


export default function RecipeEditor(props) {
    const navigate = useNavigate()

    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(null)
    const [recipe, setRecipe] = useState({})
    const [categories, setCategories] = useState([])
    const [ingredients, setIngredients] = useState([])

    const fetchRecipe = async () => {
        axios.get("http://" + properties.host + ":" + properties.port + "/recipe/" + props.selectedRecipeId).then(
            (response) => {
                const recipe = response.data

                setRecipe(recipe)
                setRecipeName(recipe.name)
                setRecipeCategory(recipe.category)
                setRecipeIngredients(recipe.ingredients)
                setRecipeSteps(recipe.steps)
                if (recipe.image != null) {
                    setRecipeImage(recipe.image)
                    setRecipeImageSelected(true)
                }
                setRecipeValid(true)

                setError(null)
                setLoaded(true)
            }).catch((error) => {
            console.error(error)
            setError(error)
        })
    }

    const fetchAutocompleteOptions = async () => {
        axios.get("http://" + properties.host + ":" + properties.port + "/list/" + props.user + "/menu").then(
            (response) => {
                setCategories(response.data.categories)
                setIngredients(response.data.ingredients)
            }).catch((error) => {
            console.error(error)
            setError(error)
        })
    }

    useEffect(() => {
        fetchAutocompleteOptions()
        if (props.selectedRecipeId != null) {
            fetchRecipe()
        } else {
            recipe.name = ""
            setRecipeName(recipe.name)
            recipe.category = ""
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
    const onCategoryChange = (newValue) => {
        setRecipeCategory(newValue)
        recipe.category = newValue
        setRecipeValid(recipeValidate)
    }

    const [recipeIngredients, setRecipeIngredients] = useState([])
    const [openAddIngredientDialog, setOpenAddIngredientDialog] = useState(false)
    const addIngredient = (newIngredient) => {
        const rIngredients = [...recipeIngredients]
        rIngredients.push(newIngredient)
        setRecipeIngredients(rIngredients)
        recipe.ingredients = rIngredients
        if (!ingredients.includes(newIngredient.name)){
            ingredients.push(newIngredient.name)
        }
    }
    const [recipeSteps, setRecipeSteps] = useState([])






    const [recipeImage, setRecipeImage] = useState(null)
    const [recipeImageSelected, setRecipeImageSelected] = useState(false)
    const selectFile = (event) => {
        // Assuming only image
        var file = event.target.files[0]
        var reader = new FileReader()
        var url = reader.readAsDataURL(file)

        reader.onloadend = function (e) {
            recipe.image = reader.result
            setRecipeImage(reader.result)
        }

        setRecipeImageSelected(true)
    }

    const [recipeValid, setRecipeValid] = useState(false)

    function recipeValidate() {
        return recipe.name !== "" && recipe.category !== null && recipe.category !== ""
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
                <div style={{backgroundColor: "lightblue", maxWidth: "600px", marginRight: "auto", marginLeft: "auto"}}>

                    <TextField label="Name" variant="outlined" component="h2"
                               value={recipeName}
                               onChange={(event) => {
                                   setRecipeName(event.target.value)
                                   recipe.name = event.target.value
                                   setRecipeValid(recipeValidate)
                               }}
                               style={{margin: "15px 0 0 30px", width: "90%"}}
                    />

                    <AutoCompleteInput value={recipeCategory}
                                       onInputChange={onCategoryChange}
                                       options={categories}
                                       style={{margin: "15px 0 0 30px", width: "90%"}}
                                        name="Category"
                    />

                    <Typography style={{margin: "20px 0 0 30px"}}>Ingredients:</Typography>
                    <Divider style={{width: "90%", marginLeft: "30px"}}/>




                    {/*TODO refactor design*/}
                    {recipeIngredients.length > 0 &&
                        <List dense style={{width: "100%"}}>
                            {recipeIngredients.map((ingredient, index) => (
                                <ListItem component="div" key={index}>
                                    <ListItemIcon>
                                        {ingredient.optional ? <NotListedLocationIcon/> : <DiamondIcon/>}
                                    </ListItemIcon>
                                    <Typography key={ingredient.name}>
                                        {ingredient.name} ({ingredient.quantity}{ingredient.unit})
                                    </Typography>
                                    <ListItemIcon
                                        color="inherit"
                                        aria-label="menu"
                                        onClick={() => {
                                            recipe.ingredients = recipe.ingredients.filter((v, i) => i !== index)
                                            setRecipeIngredients(recipe.ingredients)
                                        }}
                                    >
                                        <DeleteIcon/>
                                    </ListItemIcon>
                                </ListItem>
                            ))}
                        </List>}





                    <IconButton
                        color="inherit"
                        aria-label="menu"
                        onClick={() => setOpenAddIngredientDialog(true)}
                        style={{margin: "0 0 0 30px"}}
                    >
                        <AddCircleIcon/>
                    </IconButton>
                    <AddIngredientDialog
                        open={openAddIngredientDialog}
                        setOpen={setOpenAddIngredientDialog}
                        addIngredient={addIngredient}
                        ingredients={ingredients}
                    />

                    <Typography style={{margin: "10px 0 0 30px"}}>Steps:</Typography>
                    <Divider style={{width: "90%", marginLeft: "30px"}}/>
                    {recipeSteps.length > 0 &&
                        <List dense style={{width: "100%"}}>
                            {recipeSteps.map((step, index) => (
                                <ListItem component="div" key={index} style={{marginLeft: "20px", width: "95%"}}>

                                    <ListItemIcon style={{marginRight: "-30px"}}>
                                        {step.number}.
                                    </ListItemIcon>
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
                                        }}
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
                            }}
                            style={{margin: "0 0 0 30px"}}
                        >
                            <AddCircleIcon/>
                        </IconButton>
                    }

                    <Divider style={{width: "90%", marginLeft: "30px"}}/>



                    {/*TODO refactor design*/}
                    {!recipeImageSelected ?
                        <input type="file" name="file" onChange={selectFile}/>
                        :
                        <div>
                            <img src={recipe.image}/>
                            <IconButton
                                color="inherit"
                                aria-label="menu"
                                onClick={() => {
                                    recipe.image = null
                                    setRecipeImage(null)
                                    setRecipeImageSelected(false)
                                }}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </div>
                    }

                    <div/>
                    {/*TODO refactor design*/}
                    <Button variant="contained"
                            disabled={!recipeValid}
                            onClick={async () => {
                                setLoaded(false)
                                console.log(recipe)
                                await axios.post("http://" + props.host + ":" + props.port + "/recipe/", recipe)
                                    .then((response) => {
                                        console.log(response.data)
                                        redirectNewRecipe(response.data)
                                    })
                                    .catch((reason) => {
                                        alert(reason)
                                        setLoaded(true)
                                    })

                            }}
                    >
                        {recipe.id == null ? "Create Recipe" : "Save Recipe"}
                    </Button>

                    <p/>
                </div>}
        </>
    )
}