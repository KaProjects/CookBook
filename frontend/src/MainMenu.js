import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Collapse, List, ListItem, ListItemText} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(2),
    },
}));

const MainMenu = props => {

    const classes = useStyles();


    const [categoriesShown, setCategoriesShown] = useState(false);
    const handleCategoryClick = () => () => {
        setCategoriesShown(!categoriesShown);
    };

    const [ingredientsShown, setIngredientShown] = useState(false);
    const handleIngredientClick = () => () => {
        setIngredientShown(!ingredientsShown);
    };

    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
        >

            <ListItem button
                      selected={props.selected === 0}
                      onClick={props.handleSelection(0)}>
                <ListItemText primary="All Recipes" />
            </ListItem>

            <ListItem button onClick={handleCategoryClick()}>
                <ListItemText primary="Categories" />
                {categoriesShown ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={categoriesShown} timeout="auto" unmountOnExit>
                <List component="nav" aria-label="main mailbox folders" className={classes.nested}>
                    {props.categories.map((category) =>
                        <ListItem button
                                  selected={props.selected === category.id}
                                  onClick={props.handleSelection(category.id)}>
                            <ListItemText primary={category.name} />
                        </ListItem>
                    )}
                </List>
            </Collapse>

            <ListItem button onClick={handleIngredientClick()}>
                <ListItemText primary="Ingredients" />
                {ingredientsShown ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={ingredientsShown} timeout="auto" unmountOnExit>
                <List component="nav" aria-label="main mailbox folders" className={classes.nested}>
                    {props.ingredients.map((ingredient) =>
                        <ListItem button
                                  selected={props.selected === ingredient.id}
                                  onClick={props.handleSelection(ingredient.id)}>
                            <ListItemText primary={ingredient.name} />
                        </ListItem>
                    )}
                </List>
            </Collapse>
        </List>
    );
}

export default MainMenu;