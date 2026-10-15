import React, {useState} from "react";
import PropTypes from "prop-types";
import {useMatch, useNavigate, useSearchParams} from "react-router-dom";
import {AppBar, Box, IconButton, SwipeableDrawer, Toolbar, Tooltip, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import generatePDF, {Margin, Resolution} from "react-to-pdf";
import DeleteRecipeDialog from "./DeleteRecipeDialog";
import RecipeMenu from "./RecipeMenu";
import {useWideScreen} from "../hooks/useWideScreen";
import {useAppState} from "../state/appState";
import {colors} from "../theme/colors";

const BarButton = ({title, onClick, children, edge = false, sx}) => (
    <Tooltip title={title}>
        <IconButton size="large" edge={edge} color="inherit" aria-label={title} onClick={onClick} sx={sx}>
            {children}
        </IconButton>
    </Tooltip>
);

BarButton.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    edge: PropTypes.oneOf(["start", "end", false]),
    sx: PropTypes.object,
};

/** Leading the bar, as in the Accountant and Trading web projects: flush with its edge, apart from the title. */
const leadingButtonStyle = {mr: 2};

/**
 * The bar above every page: whose cookbook this is and which filter is on, the actions on the
 * recipe being looked at, and the way to every other page.
 */
export default function MainBar() {
    const {user, userConfig, shownRecipe} = useAppState();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const viewing = useMatch("/recipe/:id");
    const creating = useMatch("/create");
    const editing = useMatch("/recipe/:id/edit");
    // Adding a recipe and filtering the list belong to the list: on a recipe, or in the editor,
    // they would only lead away from it.
    const onRecipe = viewing || editing || creating;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const filter = searchParams.get("category") ?? searchParams.get("ingredient");
    // On a wide screen the way back to all recipes leads the bar; on a phone it stays with the
    // other buttons at the right, where the thumb is.
    const wide = useWideScreen();
    const listing = useMatch("/");
    // On a phone the bar names the category being looked at instead of the cookbook: the one open
    // in the list, or the one of the recipe shown.
    const category = wide ? null
        : listing ? searchParams.get("category")
        : viewing ? shownRecipe?.category ?? null
        : null;

    const allRecipes = (
        <BarButton title="All recipes" onClick={() => navigate("/")}
                   edge={wide ? "start" : false} sx={wide ? leadingButtonStyle : undefined}>
            <MenuBookIcon/>
        </BarButton>
    );

    return (
        <AppBar position="static">
            <Toolbar variant="dense">
                {wide && allRecipes}
                <Typography variant="h6" component="h1">
                    {category ?? <>{user}'s CookBook{filter !== null && " - " + filter}</>}
                </Typography>
                <Box sx={{flexGrow: 1}}/>
                {viewing && shownRecipe &&
                    <BarButton title="Download PDF"
                               onClick={() => generatePDF(shownRecipe.ref, {
                                   filename: shownRecipe.name.replaceAll(" ", "_") + ".pdf",
                                   resolution: Resolution.HIGH,
                                   page: {format: "A4", margin: Margin.MEDIUM},
                               })}>
                        <DownloadIcon/>
                    </BarButton>}
                {viewing &&
                    <BarButton title="Edit recipe" onClick={() => navigate(`/recipe/${encodeURIComponent(viewing.params.id)}/edit`)}>
                        <EditIcon/>
                    </BarButton>}
                {viewing &&
                    <BarButton title="Delete recipe" onClick={() => setDeleteOpen(true)}>
                        <DeleteIcon/>
                    </BarButton>}
                {!onRecipe &&
                    <BarButton title="New recipe" onClick={() => navigate("/create")}>
                        <AddIcon/>
                    </BarButton>}
                {!onRecipe &&
                    <BarButton title="Filter recipes" onClick={() => setDrawerOpen(true)}>
                        <FilterListIcon/>
                    </BarButton>}
                {!wide && allRecipes}
            </Toolbar>
            <SwipeableDrawer
                anchor={userConfig.menuAnchor}
                open={drawerOpen}
                onOpen={() => setDrawerOpen(true)}
                onClose={() => setDrawerOpen(false)}
                slotProps={{paper: {style: {minWidth: "250px", backgroundColor: colors.menuBackground}}}}
            >
                <RecipeMenu open={drawerOpen} onClose={() => setDrawerOpen(false)}/>
            </SwipeableDrawer>
            {viewing &&
                <DeleteRecipeDialog open={deleteOpen} recipeId={viewing.params.id} recipeName={shownRecipe?.name}
                                    onClose={() => setDeleteOpen(false)}/>}
        </AppBar>
    );
}
