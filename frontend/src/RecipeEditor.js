import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {useNavigate, useParams} from "react-router";
import axios from "axios";
import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  TextField, Tooltip,
  Typography
} from "@material-ui/core";
import DiamondIcon from "@mui/icons-material/Diamond";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import {Autocomplete, createFilterOptions, ListItemText, Stack} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AddNameEntityDialog from "./AddNameEntityDialog";
import DeleteIcon from '@mui/icons-material/Delete';

const useStyles = makeStyles((theme) => ({
  listItem: {

  },
}));

const RecipeEditor = props => {
  const classes = useStyles();
  const { id } = useParams();

  const [loaded, setLoaded] = useState(false);
  const [recipe, setRecipe] = useState({});
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);


  useEffect(async () => {
    await updateCategoryList();
    await updateIngredientList();

    if (id != null) {
      const response = await axios.get("http://" + props.host + ":" + props.port + "/recipe/" + id);
      // console.log(response);

      const loadedRecipe = response.data;
      setRecipe(loadedRecipe);
      setRecipeName(loadedRecipe.name);
      setRecipeCategory(loadedRecipe.category);
      setRecipeIngredients(loadedRecipe.ingredients);
      setRecipeSteps(loadedRecipe.steps);
      if (loadedRecipe.image != null) {
        setRecipeImage(loadedRecipe.image)
        setRecipeImageSelected(true)
      }
      setRecipeValid(true)
    } else {
      recipe.name = ""
      setRecipeName(recipe.name)
      recipe.category = {}
      setRecipeCategory(recipe.category)
      recipe.ingredients = [];
      setRecipeIngredients(recipe.ingredients);
      recipe.steps = [];
      setRecipeSteps(recipe.steps);
    }

    setLoaded(true);

  }, []);

  async function updateCategoryList() {
    const response = await axios.get("http://" + props.host + ":" + props.port + "/list/category/all");
    setCategories(response.data.categories);
  }

  async function updateIngredientList() {
    const response = await axios.get("http://" + props.host + ":" + props.port + "/list/ingredient/all");
    setIngredients(response.data.ingredients);
  }

  const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
  const [openAddIngredientDialog, setOpenAddIngredientDialog] = useState(false);

  const [recipeName, setRecipeName] = useState("");
  const [recipeCategory, setRecipeCategory] = useState({});
  const [recipeIngredients, setRecipeIngredients] = useState([]);

  const [addingIngredient, setAddingIngredient] = useState(false);
  const [ingredientToAdd, setIngredientToAdd] = useState({id:"",name:""});

  const [addIngredientEnabled, setAddIngredientEnabled] = useState(false);
  function addIngredientValidate(){
    return ingredientToAdd.id !== "" && ingredientToAdd.quantity != null && ingredientToAdd.quantity !== ''
              && ingredientToAdd.unit != null && ingredientToAdd.unit !== '';
  }

  const [recipeSteps, setRecipeSteps] = useState([]);

  const [addingStep, setAddingStep] = useState(false);
  const [stepToAdd, setStepToAdd] = useState({});

  const [recipeValid, setRecipeValid] = useState(false);
  function recipeValidate(){
    return recipe.name !== "" && Object.keys(recipe.category).length > 0;
  }

  const navigate = useNavigate();

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
    navigate("/recipe/" + id);
  }

  return (
    <>
      {!loaded &&
      <div style={{ position: "absolute", top: "50%", left: "50%"}}>
        <CircularProgress />
      </div>
      }
      {loaded && <div>

        <TextField id="outlined-basic" label="Name" variant="outlined" component="h2"
                   value={recipeName}
                   onChange={(event) => {
                     setRecipeName(event.target.value)
                     recipe.name = event.target.value;
                     setRecipeValid(recipeValidate)
                   }}/>

        <Stack direction="row" spacing={0}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={categories}
            getOptionLabel={(option) => option.name || ""}
            sx={{ width: 300 }}
            isOptionEqualToValue={(option, value) => option.id === value.id || Object.keys(value).length === 0}
            value={recipeCategory}
            renderInput={(params) => <TextField {...params} component="div" label="Category" />}
            onChange={(event, newValue) => {
              setRecipeCategory(newValue)
              recipe.category = newValue;
              setRecipeValid(recipeValidate)
            }}
          />
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={() => setOpenAddCategoryDialog(true)}
          >
            <AddCircleIcon />
          </IconButton>
          <AddNameEntityDialog open={openAddCategoryDialog}
                               handleOpen={setOpenAddCategoryDialog}
                               parentCallBack={updateCategoryList}
                               props={props}
                               type="category"/>
        </Stack>

        <Typography>Ingredients:</Typography>
        {recipeIngredients.length > 0 &&
          <List dense>
            {recipeIngredients.map((ingredient, index) => (
              <ListItem component="div" key={index}>
                <ListItemIcon>
                  {ingredient.optional? <NotListedLocationIcon/> : <DiamondIcon/>}
                </ListItemIcon>
                <Typography key={ingredient.name}>
                  {ingredient.name}   ({ingredient.quantity}{ingredient.unit})
                </Typography>
                <ListItemIcon
                  color="inherit"
                  aria-label="menu"
                  onClick={() => {
                    recipe.ingredients = recipe.ingredients.filter((v,i) => i !== index)
                    setRecipeIngredients(recipe.ingredients)
                  }}
                >
                  <DeleteIcon />
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
            >
              <AddCircleIcon />
            </IconButton>
          </Stack>
          :
          <Stack direction="row" spacing={0}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={ingredients}
              getOptionLabel={(option) => option.name || ""}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} component="div" label="Ingredient" />}
              isOptionEqualToValue={(option, value) => option.id === value.id || value.id === ""}
              value={ingredientToAdd}
              onChange={(event, newValue) => {
                ingredientToAdd.id = newValue == null ? "" : newValue.id;
                ingredientToAdd.name = newValue == null ? "" : newValue.name;
                setAddIngredientEnabled(addIngredientValidate())
              }}

            />
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => setOpenAddIngredientDialog(true)}
            >
              <AddCircleIcon />
            </IconButton>
            <AddNameEntityDialog open={openAddIngredientDialog}
                                 handleOpen={setOpenAddIngredientDialog}
                                 parentCallBack={updateIngredientList}
                                 props={props}
                                 type="ingredient"/>


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
                onChange={(event, checked) =>{
                  ingredientToAdd.optional = checked;
                }}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Tooltip>


            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              disabled={!addIngredientEnabled}
              onClick={() => {
                recipe.ingredients.push(ingredientToAdd)
                setIngredientToAdd({id:"",name:""})
                setAddingIngredient(false)
              }}
            >
              <AddTaskIcon/>
            </IconButton>
          </Stack>
        }

        <Typography>Steps:</Typography>
        {recipeSteps.length > 0 &&
        <List dense>
          {recipeSteps.map((step, index) => (
            <ListItem component="div" key={index}>
              <ListItemIcon>
                {step.optional? <NotListedLocationIcon/> : <AutoFixHighIcon/>}
              </ListItemIcon>
              <Typography key={step.number}>
                {step.number}. {step.text}
              </Typography>
              <ListItemIcon
                color="inherit"
                aria-label="menu"
                onClick={() => {
                  recipe.steps = recipe.steps.filter((v,i) => i !== index)
                  recipe.steps.map((step, index) => step.number = index + 1)
                  setRecipeSteps(recipe.steps)
                }}
              >
                <DeleteIcon />
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
            >
              <AddCircleIcon />
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
                onChange={(event, checked) =>{
                  stepToAdd.optional = checked;
                }}
                inputProps={{ 'aria-label': 'controlled' }}
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
          <input type="file" name="file" onChange={selectFile} />
          :
          <div>
            <img src={recipe.image} />
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={() => {
                recipe.image = null
                setRecipeImage(null)
                setRecipeImageSelected(false)
              }}
            >
              <DeleteIcon />
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