import React, {useState} from "react";
import PropTypes from "prop-types";
import {useMatch, useNavigate, useSearchParams} from "react-router-dom";
import {AppBar, Box, IconButton, SwipeableDrawer, Toolbar, Tooltip, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import generatePDF from "react-to-pdf";
import RecipeMenu from "./RecipeMenu";
import {useAppState} from "../state/appState";
import {colors} from "../theme/colors";

const BarButton = ({title, onClick, children}) => (
    <Tooltip title={title}>
        <IconButton size="large" color="inherit" aria-label={title} onClick={onClick}>
            {children}
        </IconButton>
    </Tooltip>
);

BarButton.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

/**
 * The bar above every page: whose cookbook this is and which filter is on, the actions on the
 * recipe being looked at, and the way to every other page.
 */
export default function MainBar() {
    const {user, userConfig, pdfTarget} = useAppState();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const viewing = useMatch("/recipe/:id");
    const [drawerOpen, setDrawerOpen] = useState(false);

    const filter = searchParams.get("category") ?? searchParams.get("ingredient");

    return (
        <AppBar position="static">
            <Toolbar variant="dense">
                <Typography variant="h6" component="h1">
                    {user}'s CookBook{filter !== null && " - " + filter}
                </Typography>
                <Box sx={{flexGrow: 1}}/>
                {viewing && pdfTarget &&
                    <BarButton title="Download PDF"
                               onClick={() => generatePDF(pdfTarget.ref, {filename: pdfTarget.name.replaceAll(" ", "_") + ".pdf"})}>
                        <DownloadIcon/>
                    </BarButton>}
                {viewing &&
                    <BarButton title="Edit recipe" onClick={() => navigate(`/recipe/${encodeURIComponent(viewing.params.id)}/edit`)}>
                        <EditIcon/>
                    </BarButton>}
                <BarButton title="New recipe" onClick={() => navigate("/create")}>
                    <AddIcon/>
                </BarButton>
                <BarButton title="Filter recipes" onClick={() => setDrawerOpen(true)}>
                    <FilterListIcon/>
                </BarButton>
                <BarButton title="All recipes" onClick={() => navigate("/")}>
                    <MenuBookIcon/>
                </BarButton>
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
        </AppBar>
    );
}
