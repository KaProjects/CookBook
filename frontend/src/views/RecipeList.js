import React from "react"
import {List, ListItem, ListItemText} from "@mui/material"
import {useNavigate} from "react-router"
import {useData} from "../fetch"
import Loader from "../components/Loader"

export default function RecipeList(props) {

    const navigate = useNavigate()

    const showRecipe = (recipeId) => () => {
        props.setSelectedRecipe(recipeId)
        navigate('/recipe')
    }

    const {data, loaded, error} = useData("/list/" + props.user + "/recipe"
        + (props.categoryFilter !== null ? "?category=" + props.categoryFilter : "")
        + (props.ingredientFilter !== null ? "?ingredient=" + props.ingredientFilter : ""))

    const list = {paddingRight: "8px", display: "block"}
    const item = {margin: "0px 2px 4px 4px", width: "100%", boxShadow: "0 0 8px 0", backgroundColor: "rgb(253,141,141)"}

    return (
        <>
            {!loaded &&
                <Loader error={error}/>
            }
            {loaded &&
                <List style={list}>
                    {data.recipes.length > 0 && data.recipes.map((recipe, index) => (
                        <ListItem style={item}
                                  button
                                  key={index}
                                  onClick={showRecipe(recipe.id)}>
                            <ListItemText primary={recipe.name}/>
                        </ListItem>
                    ))}
                </List>
            }
        </>
    )
}