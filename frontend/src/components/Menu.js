import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {CircularProgress, Collapse, List, ListItem, ListItemText} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {Box, Grid} from "@mui/material";

const useStyles = makeStyles((theme) => ({
    menuList: {
        width: 150,
        backgroundColor: "rgb(113,201,76)",
        // background: 'linear-gradient(90deg, rgba(3,71,164,1) 0%, rgba(19,226,255,1) 23%, rgba(2,174,176,1) 100%)',
        // border: 0,
        // borderRadius: 3,
        // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        // padding: '0 30px',
        // color: theme.palette.text.primary,
    },
    recipeList: {
        // width: "100%",
        backgroundColor: "rgb(201, 76, 76)",
    },
    nested: {
        paddingLeft: theme.spacing(2),
        color: theme.palette.text.primary,
    },
}));

const Menu = props => {

    const classes = useStyles();

    const [categoriesShown, setCategoriesShown] = useState(false);
    const handleCategoriesClick = () => () => {
        setCategoriesShown(!categoriesShown);
    };

    const [ingredientsShown, setIngredientShown] = useState(false);
    const handleIngredientsClick = () => () => {
        setIngredientShown(!ingredientsShown);
    };

    return (
        <div>
          {!props.loaded &&
          <div style={{ position: "absolute", top: "50%", left: "50%"}}>
            <CircularProgress />
          </div>
          }
          {props.loaded &&
          <Box sx={{ flexGrow: 1 }}>
            <Grid container>
              <Grid item xs="auto">
                  <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    className={classes.menuList}
                  >
                      <ListItem button
                                selected={props.selectedMenu === 0}
                                onClick={props.showAllRecipes()}>
                          <ListItemText primary="All Recipes" />
                      </ListItem>

                      <ListItem button onClick={handleCategoriesClick()}>
                          <ListItemText primary="Categories" />
                          {categoriesShown ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse in={categoriesShown} timeout="auto" unmountOnExit>
                          <List component="nav" aria-label="main mailbox folders" className={classes.nested}>
                              {props.categories.map((category, index) =>
                                <ListItem button
                                          key={index}
                                          selected={props.selectedMenu === category}
                                          onClick={props.showCategoryRecipes(category)}>
                                    <ListItemText primary={category} />
                                </ListItem>
                              )}
                          </List>
                      </Collapse>

                      <ListItem button onClick={handleIngredientsClick()}>
                          <ListItemText primary="Ingredients" />
                          {ingredientsShown ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse in={ingredientsShown} timeout="auto" unmountOnExit>
                          <List component="nav" aria-label="main mailbox folders" className={classes.nested}>
                              {props.ingredients.map((ingredient, index) =>
                                <ListItem button
                                          key={index}
                                          selected={props.selectedMenu === ingredient}
                                          onClick={props.showIngredientRecipes(ingredient)}>
                                    <ListItemText primary={ingredient} />
                                </ListItem>
                              )}
                          </List>
                      </Collapse>
                  </List>

              </Grid>
            </Grid>
          </Box>
          }
        </div>
    );
}

export default Menu;