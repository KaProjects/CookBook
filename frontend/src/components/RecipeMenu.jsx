import React, {useState} from "react";
import PropTypes from "prop-types";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Avatar, Box, Button, Chip, IconButton, InputAdornment, List, ListItemAvatar, ListItemButton, ListItemText, Tab, Tabs,
    TextField, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Loader from "./Loader";
import {useData} from "../fetch";
import {paths} from "../services/api";
import {useAppState} from "../state/appState";
import {categoryTint} from "../theme/colors";

const FILTERS = {ingredients: "ingredient", categories: "category"};

/** The ingredients as chips, narrowed by what is typed above them; the one filtered by is filled. */
function Ingredients({ingredients, active, onPick}) {
    const [search, setSearch] = useState("");
    const shown = ingredients.filter((ingredient) => ingredient.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));

    return (
        <Box sx={{px: 2, py: 1.5}}>
            <TextField size="small" fullWidth placeholder="Search ingredients" value={search}
                       onChange={(event) => setSearch(event.target.value)}
                       slotProps={{
                           htmlInput: {"aria-label": "Search ingredients"},
                           input: {startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small"/></InputAdornment>},
                       }}/>
            {shown.length === 0 && <Typography color="text.secondary" sx={{mt: 2}}>No ingredient matches.</Typography>}
            <Box component="ul" aria-label="Ingredients" sx={{listStyle: "none", m: 0, mt: 1.5, p: 0, display: "flex", flexWrap: "wrap", gap: 1}}>
                {shown.map((ingredient) => (
                    <li key={ingredient}>
                        <Chip label={ingredient} clickable onClick={() => onPick(ingredient)}
                              color={ingredient === active ? "primary" : "default"}
                              variant={ingredient === active ? "filled" : "outlined"}/>
                    </li>
                ))}
            </Box>
        </Box>
    );
}

Ingredients.propTypes = {
    ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
    active: PropTypes.string,
    onPick: PropTypes.func.isRequired,
};

/** The categories as rows, each with its initial on the category's own tint, as on the phone list. */
const Categories = ({categories, active, onPick}) => (
    <List aria-label="Categories" sx={{py: 1}}>
        {categories.map((category) => {
            const tint = categoryTint(category);
            return (
                <ListItemButton key={category} selected={category === active} onClick={() => onPick(category)} sx={{px: 2}}>
                    <ListItemAvatar sx={{minWidth: 48}}>
                        <Avatar aria-hidden variant="rounded" sx={{width: 34, height: 34, fontSize: 15, fontWeight: 500,
                                                                  bgcolor: tint.background, color: tint.text}}>
                            {category.charAt(0).toUpperCase()}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={category}/>
                </ListItemButton>
            );
        })}
    </List>
);

Categories.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    active: PropTypes.string,
    onPick: PropTypes.func.isRequired,
};

/**
 * The filters of the user's recipes, by ingredient or by category, a tab apart, with the filter in
 * use on top and a way to clear it. It is read each time the drawer opens, so a recipe saved since
 * shows up in it.
 */
export default function RecipeMenu({open, onClose}) {
    const {user} = useAppState();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {data, loaded, error} = useData(paths.menu(user), open);
    const [tab, setTab] = useState(searchParams.has("category") ? "categories" : "ingredients");

    const activeIngredient = searchParams.get("ingredient");
    const activeCategory = searchParams.get("category");
    const active = activeIngredient ?? activeCategory;

    const go = (to) => {
        onClose();
        navigate(to);
    };
    const pick = (filter) => (value) => go("/?" + new URLSearchParams({[filter]: value}).toString());

    return (
        <Box component="nav" aria-label="Filter recipes" sx={{display: "flex", flexDirection: "column", height: "100%"}}>
            <Box sx={{display: "flex", alignItems: "center", pl: 2, pr: 1, py: 1}}>
                <Typography variant="h6" component="h2" sx={{flexGrow: 1}}>Filter recipes</Typography>
                <IconButton aria-label="Close" onClick={onClose}><CloseIcon/></IconButton>
            </Box>

            {active !== null &&
                <Box sx={{display: "flex", alignItems: "center", gap: 1, px: 2, pb: 1.5}}>
                    <Typography variant="body2" color="text.secondary">
                        {activeIngredient !== null ? "Ingredient" : "Category"}
                    </Typography>
                    <Chip label={active} color="primary"/>
                    <Button size="small" onClick={() => go("/")} sx={{ml: "auto"}}>Clear</Button>
                </Box>}

            <Tabs value={tab} onChange={(event, value) => setTab(value)} variant="fullWidth"
                  sx={{borderBottom: "1px solid", borderColor: "divider"}}>
                <Tab value="ingredients" label="Ingredients" id="filter-tab-ingredients" aria-controls="filter-panel"/>
                <Tab value="categories" label="Categories" id="filter-tab-categories" aria-controls="filter-panel"/>
            </Tabs>

            <Box role="tabpanel" id="filter-panel" aria-labelledby={`filter-tab-${tab}`} sx={{flexGrow: 1, overflowY: "auto"}}>
                {!loaded
                    ? <Loader error={error}/>
                    : tab === "ingredients"
                        ? <Ingredients ingredients={data.ingredients} active={activeIngredient} onPick={pick(FILTERS.ingredients)}/>
                        : <Categories categories={data.categories} active={activeCategory} onPick={pick(FILTERS.categories)}/>}
            </Box>
        </Box>
    );
}

RecipeMenu.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
