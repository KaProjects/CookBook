import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useParams} from "react-router";
import axios from "axios";
import {
  Avatar, Box, CircularProgress,
  Divider, IconButton, Link,
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
import EditIcon from "@mui/icons-material/Edit";
import {Stack} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  listItem: {

  },
}));

const Recipe = props => {
  const classes = useStyles();
  const { id } = useParams();
  const editRef = "/recipe/" + id + "/edit";

  const [recipe, setRecipe] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(async () => {
    const response = await axios.get("http://" + props.host + ":" + props.port + "/recipe/" + id);
    setRecipe(response.data);
    setLoaded(true)
  }, []);

  return (
    <>
      {!loaded &&
      <div style={{ position: "absolute", top: "50%", left: "50%"}}>
        <CircularProgress />
      </div>
      }
      {loaded && recipe != null && <div>
        <Stack direction="row" spacing={2}>
          <Typography variant="h2" component="h2">
            {recipe.name}
          </Typography>
          <Link href={editRef} underline="none" color="inherit" >
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
            >
              <EditIcon/>
            </IconButton>
          </Link>
        </Stack>


        <Typography variant="h5" component="h5">
          category: {recipe.category.name}
        </Typography>

        <div/>
        <Divider variant="fullWidth" component="div"/>
        <div/>

        <List dense >
          {recipe.ingredients.map((ingredient) =>
            <div key={ingredient.id}>
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
            <div key={ingredient.id}>
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