import React, {useState} from "react"
import {useNavigate} from "react-router"
import Loader from "../components/Loader"
import {useData} from "../fetch"
import {Collapse, List, ListItemButton, ListItemText} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";


export default function RecipeMenu({props, closeDrawer, flag}) {
    const navigate = useNavigate()

    const {data, loaded, error} = useData("/list/" + props.user + "/menu", flag)

    const [categoriesShown, setCategoriesShown] = useState(false)
    const handleCategoriesClick = () => () => {
        setCategoriesShown(!categoriesShown)
    }

    const [ingredientsShown, setIngredientShown] = useState(true)
    const handleIngredientsClick = () => () => {
        setIngredientShown(!ingredientsShown)
    }

    const handleShowIngredientRecipes = (ingredient) => () => {
        props.showIngredientRecipes(ingredient)
        redirectToRecipes()
    }

    const handleShowCategoryRecipes = (category) => () => {
        props.showCategoryRecipes(category)
        redirectToRecipes()
    }

    const redirectToRecipes = () => {
        setIngredientShown(true)
        setCategoriesShown(false)
        closeDrawer()
        navigate('/')
    }

    const list = {paddingRight: "8px", display: "block"}
    const item = {margin: "0px 2px 4px 4px", width: "100%", boxShadow: "0 0 8px 0", backgroundColor: "rgb(113,201,76)"}
    const nestedList = {display: "block", margin: "-10px 0 -5px 0"}
    const nestedItem = {margin: "0 0 2px 4px", width: "100%", boxShadow: "0 0 4px 0", backgroundColor: "rgb(162,225,136)"}

    return (
        <>
            {!loaded &&
                <Loader error={error}/>
            }
            {loaded &&
                <List style={list}>
                    <ListItemButton style={item} onClick={handleIngredientsClick()}>
                        <ListItemText primary="Ingredients"/>
                        {ingredientsShown ? <ExpandLess/> : <ExpandMore/>}
                    </ListItemButton>
                    <Collapse in={ingredientsShown} timeout="auto" unmountOnExit>
                        <List style={nestedList}>
                            {data.ingredients.slice()
                                .sort((a,b) => a.localeCompare(b))
                                .map((ingredient, index) =>
                                    <ListItemButton style={nestedItem} key={index} onClick={handleShowIngredientRecipes(ingredient)}>
                                        <ListItemText primary={ingredient}/>
                                    </ListItemButton>
                                )}
                        </List>
                    </Collapse>

                    <ListItemButton style={item} onClick={handleCategoriesClick()}>
                        <ListItemText primary="Categories"/>
                        {categoriesShown ? <ExpandLess/> : <ExpandMore/>}
                    </ListItemButton>
                    <Collapse in={categoriesShown} timeout="auto" unmountOnExit>
                        <List style={nestedList}>
                            {data.categories.slice()
                                .sort((a,b) => a.localeCompare(b))
                                .map((category, index) =>
                                    <ListItemButton style={nestedItem} key={index} onClick={handleShowCategoryRecipes(category)}>
                                        <ListItemText primary={category}/>
                                    </ListItemButton>
                                )}
                        </List>
                    </Collapse>
                </List>
            }
        </>
    )
}