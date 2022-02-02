import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Collapse, List, ListItem, ListItemText} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 300,
        // background: 'linear-gradient(90deg, rgba(3,71,164,1) 0%, rgba(19,226,255,1) 23%, rgba(2,174,176,1) 100%)',
        // border: 0,
        // borderRadius: 3,
        // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        // padding: '0 30px',
        // color: theme.palette.text.primary,
    },
    nested: {
        paddingLeft: theme.spacing(2),
        color: theme.palette.text.primary,
    },
}));

const MainMenu = props => {
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
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
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
                    {props.categories.map((category) =>
                        <ListItem button
                                  selected={props.selectedMenu === category.id}
                                  onClick={props.showCategoryRecipes(category.id)}>
                            <ListItemText primary={category.name} />
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
                    {props.ingredients.map((ingredient) =>
                        <ListItem button
                                  selected={props.selectedMenu === ingredient.id}
                                  onClick={props.showIngredientRecipes(ingredient.id)}>
                            <ListItemText primary={ingredient.name} />
                        </ListItem>
                    )}
                </List>
            </Collapse>
        </List>
    );
}

export default MainMenu;