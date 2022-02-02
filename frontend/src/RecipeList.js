import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
}));

const RecipeList = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {props.recipes.length > 0 && props.recipes.map((recipe, index) => (

        <Typography className={classes.heading}>{index} {recipe.name}</Typography>
      ))}
    </div>
  );
}

export default RecipeList;