import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import axios from "axios";
import {
    Button,
    Checkbox,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core";
import DiamondIcon from "@mui/icons-material/Diamond";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import {Autocomplete, Stack} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddTaskIcon from '@mui/icons-material/AddTask';
import DeleteIcon from '@mui/icons-material/Delete';
import {properties} from "../properties";
import Loader from "../components/Loader";
import { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

const RecipeEditor = props => {
    const navigate = useNavigate();

    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [recipe, setRecipe] = useState({});
    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    const fetchRecipe = async () => {
        axios.get("http://" + properties.host + ":" + properties.port + "/recipe/" + props.selectedRecipeId).then(
            (response) => {
                const recipe = response.data

                setRecipe(recipe);
                setRecipeName(recipe.name);
                setRecipeCategory(recipe.category);
                setRecipeIngredients(recipe.ingredients);
                setRecipeSteps(recipe.steps);
                if (recipe.image != null) {
                    setRecipeImage(recipe.image)
                    setRecipeImageSelected(true)
                }
                setRecipeValid(true)

                setError(null)
                setLoaded(true);
            }).catch((error) => {
            console.error(error)
            setError(error)
        })
    };

    const fetchAutocompleteOptions = async () => {
        axios.get("http://" + properties.host + ":" + properties.port + "/list/" + props.user + "/menu").then(
            (response) => {
                setCategories(response.data.categories)
                setIngredients(response.data.ingredients)
            }).catch((error) => {
            console.error(error)
            setError(error)
        })
    };

    useEffect(() => {
        fetchAutocompleteOptions();
        if (props.selectedRecipeId != null) {
            fetchRecipe();
        } else {
            recipe.name = ""
            setRecipeName(recipe.name)
            recipe.category = ""
            setRecipeCategory(recipe.category)
            recipe.ingredients = [];
            setRecipeIngredients(recipe.ingredients);
            recipe.steps = [];
            setRecipeSteps(recipe.steps);
            setLoaded(true);
        }
    }, []);

    const [recipeName, setRecipeName] = useState("");
    const [recipeCategory, setRecipeCategory] = useState("");


    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [addingIngredient, setAddingIngredient] = useState(false);
    const [ingredientToAdd, setIngredientToAdd] = useState({id: "", name: ""});
    const [addIngredientEnabled, setAddIngredientEnabled] = useState(false);

    function addIngredientValidate() {
        return ingredientToAdd.id !== "" && ingredientToAdd.quantity != null && ingredientToAdd.quantity !== ''
            && ingredientToAdd.unit != null && ingredientToAdd.unit !== '';
    }

    const [recipeSteps, setRecipeSteps] = useState([]);
    const [addingStep, setAddingStep] = useState(false);
    const [stepToAdd, setStepToAdd] = useState({});

    const [recipeValid, setRecipeValid] = useState(false);

    function recipeValidate() {
        return recipe.name !== "" && recipe.category !== null && recipe.category !== "";
    }

    const [recipeImage, setRecipeImage] = useState(null);
    const [recipeImageSelected, setRecipeImageSelected] = useState(false);
    const selectFile = (event) => {
        // Assuming only image
        var file = event.target.files[0];
        var reader = new FileReader();
        var url = reader.readAsDataURL(file);

        reader.onloadend = function (e) {
            recipe.image = reader.result;
            setRecipeImage(reader.result);
        };

        setRecipeImageSelected(true);
    };

    function redirectNewRecipe(id) {
        props.setSelectedRecipe(id);
        navigate("/recipe");
    }

    const autocompleteOption = {width: "600px", margin: "0px 0px 1px 0px", boxShadow: "0 0 1px 0", backgroundColor: "rgb(255,255,255)"}

    return (
        <>
            {!loaded &&
                <Loader error={error}/>
            }
            {loaded && <div style={{backgroundColor: "lightblue", maxWidth: "600px", marginRight: "auto", marginLeft:"auto"}}>

                <TextField label="Name" variant="outlined" component="h2"
                           value={recipeName}
                           onChange={(event) => {
                               setRecipeName(event.target.value)
                               recipe.name = event.target.value;
                               setRecipeValid(recipeValidate)
                           }}
                           style={{ margin: "10px 0 0 0", width: "90%", left: "50%", transform: "translate(-50%, 0)"}}
                />

                <Autocomplete
                    value={recipeCategory}
                    onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                            setRecipeCategory(newValue)
                            recipe.category = newValue;
                            setRecipeValid(recipeValidate)
                        } else if (newValue && newValue.inputValue) {
                            // Create a new value from the user input
                            setRecipeCategory(newValue.inputValue)
                            recipe.category = newValue.inputValue;
                            setRecipeValid(recipeValidate)
                        } else {
                            setRecipeCategory(newValue)
                            recipe.category = newValue;
                            setRecipeValid(recipeValidate)
                        }
                    }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        const isExisting = options.some((option) => inputValue === option.title);
                        if (inputValue !== '' && !isExisting) {
                            filtered.push({
                                inputValue,
                                title: `Add "${inputValue}"`,
                            });
                        }

                        return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    options={categories}
                    getOptionLabel={(option) => {
                        // Value selected with enter, right from the input
                        if (typeof option === 'string') {
                            return option;
                        }
                        // Add "xxx" option created dynamically
                        if (option.inputValue) {
                            return option.inputValue;
                        }
                        // Regular option
                        return option.title;
                    }}
                    renderOption={(props, option) => <Typography {...props} style={autocompleteOption}>{option.title === undefined ? option : option.title}</Typography>}
                    freeSolo
                    renderInput={(params) => <TextField {...params} component="div" label="Category"/>}
                    style={{margin: "15px 0 0 30px", width: "90%"}}
                />




                <Typography style={{margin: "20px 0 0 30px"}}>Ingredients:</Typography>
                {recipeIngredients.length > 0 &&
                    <List dense>
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

                {!addingIngredient ?
                    <Stack direction="row" spacing={0}>
                        <IconButton
                            color="inherit"
                            aria-label="menu"
                            onClick={() => {
                                setAddIngredientEnabled(addIngredientValidate())
                                setAddingIngredient(true)
                            }}
                            style={{margin: "0 0 0 30px"}}
                        >
                            <AddCircleIcon/>
                        </IconButton>
                    </Stack>
                    :
                    <Stack direction="row" spacing={0}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={ingredients}
                            getOptionLabel={(option) => option.name || ""}
                            sx={{width: 300}}
                            renderInput={(params) => <TextField {...params} component="div" label="Ingredient"/>}
                            isOptionEqualToValue={(option, value) => option.id === value.id || value.id === ""}
                            value={ingredientToAdd}
                            onChange={(event, newValue) => {
                                ingredientToAdd.id = newValue == null ? "" : newValue.id;
                                ingredientToAdd.name = newValue == null ? "" : newValue.name;
                                setAddIngredientEnabled(addIngredientValidate())
                            }}

                        />

                        <TextField id="outlined-basic" label="Quantity" variant="outlined" component="h2"
                                   value={ingredientToAdd.quantity}
                                   onChange={(event) => {
                                       ingredientToAdd.quantity = event.target.value;
                                       setAddIngredientEnabled(addIngredientValidate())
                                   }}/>
                        <TextField id="outlined-basic" label="Unit" variant="outlined" component="h2"
                                   value={ingredientToAdd.unit}
                                   onChange={(event) => {
                                       ingredientToAdd.unit = event.target.value;
                                       setAddIngredientEnabled(addIngredientValidate())
                                   }}/>

                        <Tooltip title="Optional?">
                            <Checkbox
                                checked={ingredientToAdd.optional}
                                onChange={(event, checked) => {
                                    ingredientToAdd.optional = checked;
                                }}
                                inputProps={{'aria-label': 'controlled'}}
                            />
                        </Tooltip>


                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            disabled={!addIngredientEnabled}
                            onClick={() => {
                                recipe.ingredients.push(ingredientToAdd)
                                setIngredientToAdd({id: "", name: ""})
                                setAddingIngredient(false)
                            }}
                        >
                            <AddTaskIcon/>
                        </IconButton>
                    </Stack>
                }

                <Typography style={{margin: "10px 0 0 30px"}}>Steps:</Typography>

                {/*TODO add step prida n-ty step s "" value */}
                {/*TODO all steps editovatelne kedykolvek */}
                {/*TODO delete last step */}

                {recipeSteps.length > 0 &&
                    <List dense>
                        {recipeSteps.map((step, index) => (
                            <ListItem component="div" key={index}>
                                <ListItemIcon>
                                    {step.optional ? <NotListedLocationIcon/> : <AutoFixHighIcon/>}
                                </ListItemIcon>
                                <Typography key={step.number}>
                                    {step.number}. {step.text}
                                </Typography>
                                <ListItemIcon
                                    color="inherit"
                                    aria-label="menu"
                                    onClick={() => {
                                        recipe.steps = recipe.steps.filter((v, i) => i !== index)
                                        recipe.steps.map((step, index) => step.number = index + 1)
                                        setRecipeSteps(recipe.steps)
                                    }}
                                >
                                    <DeleteIcon/>
                                </ListItemIcon>
                            </ListItem>
                        ))}
                    </List>}

                {!addingStep ?
                    <Stack direction="row" spacing={0}>
                        <IconButton
                            color="inherit"
                            aria-label="menu"
                            onClick={() => {
                                // setAddIngredientEnabled(addIngredientValidate())
                                setAddingStep(true)
                            }}
                            style={{margin: "0 0 0 30px"}}
                        >
                            <AddCircleIcon/>
                        </IconButton>
                    </Stack>
                    :
                    <Stack direction="row" spacing={0}>
                        <TextField id="outlined-basic" label="Text" variant="outlined" component="h2"
                                   value={stepToAdd.text}
                                   fullWidth
                                   onChange={(event) => {
                                       stepToAdd.text = event.target.value;
                                       // setAddIngredientEnabled(addIngredientValidate())
                                   }}/>

                        <Tooltip title="Optional?">
                            <Checkbox
                                checked={stepToAdd.optional}
                                onChange={(event, checked) => {
                                    stepToAdd.optional = checked;
                                }}
                                inputProps={{'aria-label': 'controlled'}}
                            />
                        </Tooltip>

                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={() => {
                                stepToAdd.number = recipe.steps.length + 1
                                recipe.steps.push(stepToAdd)
                                setStepToAdd({})
                                setAddingStep(false)
                            }}
                        >
                            <AddTaskIcon/>
                        </IconButton>
                    </Stack>
                }

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
                                });

                        }}
                >
                    {recipe.id == null ? "Create Recipe" : "Save Changes"}
                </Button>

                <p/>
            </div>}
        </>
    );
}

export default RecipeEditor;