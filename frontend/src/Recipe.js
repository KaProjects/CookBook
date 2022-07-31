import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useParams} from "react-router";
import axios from "axios";
import {
  Avatar, Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Typography
} from "@material-ui/core";
import DiamondIcon from '@mui/icons-material/Diamond';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const useStyles = makeStyles((theme) => ({
  listItem: {

  },
}));

const Recipe = props => {
  const classes = useStyles();
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);

  useEffect(async () => {
    const response = await axios.get("http://" + props.host + ":" + props.port + "/recipe/" + id);
    console.log(response);
    setRecipe(response.data);
  }, []);

  return (
    <>
      {recipe != null && <div>
        <Typography variant="h2" component="h2">
          {recipe.name}
        </Typography>

        <Typography variant="h5" component="h5">
          category: {recipe.category}
        </Typography>

        <div/>
        <Divider variant="fullWidth" component="div"/>
        <div/>

        <List dense >
          {recipe.ingredients.map((ingredient) =>
            <div>
              {!ingredient.optional &&
                <ListItem component="div">
                  <ListItemIcon>
                    <DiamondIcon/>
                  </ListItemIcon>
                  <Typography key={ingredient.name}>
                    {ingredient.name}   ({ingredient.quantity}{ingredient.unit})
                  </Typography>
                </ListItem>}
            </div>
          )}
          {recipe.ingredients.map((ingredient) =>
            <div>
              {ingredient.optional &&
              <ListItem component="div">
                <ListItemIcon>
                  <NotListedLocationIcon/>
                </ListItemIcon>
                <Typography key={ingredient.name}>
                  {ingredient.name}   ({ingredient.quantity}{ingredient.unit})
                </Typography>
              </ListItem>}
            </div>
          )}
        </List>

        <div/>
        <Divider variant="fullWidth" component="div"/>
        <div/>

        <List dense >
        {recipe.steps.map((step) =>
          <ListItem component="div" key={step.number}>
            <ListItemIcon>
              {!step.optional && <AutoFixHighIcon/>}
              {step.optional && <NotListedLocationIcon/>}
            </ListItemIcon>
            <Typography key={step.number}>
              {step.number}.   {step.text}
            </Typography>
          </ListItem>
        )}
        </List>
      </div>}
    </>
  );
}

export default Recipe;