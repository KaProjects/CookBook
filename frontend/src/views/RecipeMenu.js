import {Collapse, List, ListItem, ListItemText} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import React, {useState} from "react";
import {useNavigate} from "react-router";
import Loader from "../components/Loader";
import {useData} from "../fetch";


const RecipeMenu = props => {
    const navigate = useNavigate();

    const {data, loaded, error} = useData("/list/" + props.user + "/menu");

    const [categoriesShown, setCategoriesShown] = useState(false);
    const handleCategoriesClick = () => () => {
        setCategoriesShown(!categoriesShown);
    };

    const [ingredientsShown, setIngredientShown] = useState(false);
    const handleIngredientsClick = () => () => {
        setIngredientShown(!ingredientsShown);
    };

    const handleShowAllRecipes = () => () => {
        props.showAllRecipes();
        redirectToRecipes();
    }

    const handleShowIngredientRecipes = (ingredient) => () => {
        props.showIngredientRecipes(ingredient);
        redirectToRecipes();
    }

    const handleShowCategoryRecipes = (category) => () => {
        props.showCategoryRecipes(category);
        redirectToRecipes();
    }

    const redirectToRecipes = () => {
        setIngredientShown(false);
        setCategoriesShown(false);
        navigate('/');
    };

    const handleCreateRecipe = () => {

    }

    const list = {paddingRight: "8px", display: "block"}
    const item = {margin: "0px 2px 4px 4px", width: "100%", boxShadow: "0 0 8px 0", backgroundColor: "rgb(113,201,76)"}
    const nestedList = {
        paddingRight: "8px",
        display: "block",
        margin: "-4px -4px 4px 4px",
        boxShadow: "0 0 2px 0",
        backgroundColor: "rgb(176,227,155)"
    }
    const nestedItem = {
        margin: "0px 2px 4px 4px",
        width: "100%",
        boxShadow: "0 0 8px 0",
        backgroundColor: "rgb(162,225,136)"
    }

    return (
        <>
            {!loaded &&
                <Loader error={error}/>
            }
            {loaded &&
                <List style={list}>
                    <ListItem button
                              onClick={handleShowAllRecipes()}
                              style={item}
                    >
                        <ListItemText primary="All Recipes"/>
                    </ListItem>

                    <ListItem button
                              onClick={handleCategoriesClick()}
                              style={item}
                    >
                        <ListItemText primary="Categories"/>
                        {categoriesShown ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={categoriesShown} timeout="auto" unmountOnExit>
                        <List style={nestedList}>
                            {data.categories.map((category, index) =>
                                <ListItem button
                                          key={index}
                                          onClick={handleShowCategoryRecipes(category)}
                                          style={nestedItem}
                                >
                                    <ListItemText primary={category}/>
                                </ListItem>
                            )}
                        </List>
                    </Collapse>

                    <ListItem button
                              onClick={handleIngredientsClick()}
                              style={item}
                    >
                        <ListItemText primary="Ingredients"/>
                        {ingredientsShown ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={ingredientsShown} timeout="auto" unmountOnExit>
                        <List style={nestedList}>
                            {data.ingredients.map((ingredient, index) =>
                                <ListItem button
                                          key={index}
                                          onClick={handleShowIngredientRecipes(ingredient)}
                                          style={nestedItem}
                                >
                                    <ListItemText primary={ingredient}/>
                                </ListItem>
                            )}
                        </List>
                    </Collapse>

                    <ListItem button
                              onClick={handleCreateRecipe()}
                              style={item}
                    >
                        <ListItemText primary="Create Recipe"/>
                    </ListItem>
                </List>
            }
        </>
    )
}
export default RecipeMenu;