import React from "react";
import {List, ListItem, ListItemText} from "@mui/material";
import {useNavigate} from "react-router";
import {useData} from "../fetch";
import Loader from "../components/Loader";

const RecipeList = props => {

  const navigate = useNavigate();

  const showRecipe = (recipeId) => () => {
    props.setSelectedRecipe(recipeId);
    navigate('/recipe');
  }

  const {data, loaded, error} = useData("/list/" + props.user + "/recipe"
      + (props.categoryFilter !== null ? "?category=" + props.categoryFilter : "")
      + (props.ingredientFilter !== null ? "?ingredient=" + props.ingredientFilter : ""))


  return (
      <>
        {!loaded &&
            <Loader error ={error}/>
        }
        {loaded &&
          <List component="nav"
                aria-labelledby="nested-list-subheader"
                style={{}}
          >
              {data.recipes.length > 0 && data.recipes.map((recipe, index) => (
                  <>
                    <ListItem style={{marginLeft: "2px", boxShadow: "0 0 8px 0", marginBottom: "4px", backgroundColor: "rgb(201, 76, 76)"}}
                              button
                              key={index}
                              onClick={showRecipe(recipe.id)}>
                      <ListItemText primary={recipe.name}/>
                    </ListItem>
                  </>
              ))}
          </List>
        }
      </>
  );
}

export default RecipeList;