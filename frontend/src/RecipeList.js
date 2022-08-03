import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {List, ListItem, ListItemText} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {IconButton, Link} from "@material-ui/core";
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from "@mui/icons-material/AddBox";

const useStyles = makeStyles((theme) => ({
  list: {
    // width: "100%",
    backgroundColor: "rgb(201, 76, 76)",
  },
  item: {
    // width: 1000,
    // alignItems: "center",
    // backgroundColor: "rgb(201, 76, 76)",
    // color: "black",
  },
}));

const RecipeList = props => {
  const classes = useStyles();

  // function handleClick(id) {
  //   history.push("/recipe/"+id)
  // }

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.list}
    >
      {props.recipes.length > 0 && props.recipes.map((recipe, index) => (
        <>
          <ListItem className={classes.item} button
                    key={index}

            // onClick={props.loadRecipe(recipe.id) }
                    onClick={() => props.loadRecipe(recipe.id)}
          >
            <ListItemText  primary={recipe.name} />
          </ListItem>
        </>
      ))}

    </List>
  );
}

export default RecipeList;