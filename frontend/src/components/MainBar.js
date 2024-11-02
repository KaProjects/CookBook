import React, {useState} from "react"
import MenuIcon from "@mui/icons-material/Menu"
import {AppBar, Box, IconButton, SwipeableDrawer, Toolbar, Typography} from "@mui/material"
import RecipeMenu from "../views/RecipeMenu";
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from "react-router"
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import generatePDF from "react-to-pdf";

export default function MainBar(props) {
    const navigate = useNavigate()
    const [openDrawer, setOpenDrawer] = useState(false)

    const handleCreateRecipe = () => {
        props.setSelectedRecipe(null)
        navigate('/create')
    }

    const handleEditRecipe = () => {
        navigate('/edit')
    }

    const handleShowAllRecipes = () => {
        props.showAllRecipes()
        navigate('/')
    }

    return (
        <AppBar position="static">
            <Toolbar variant="dense">
                <Typography variant="h6" component="div">
                    {props.user}'s CookBook
                    {props.categoryFilter != null ? " - " + props.categoryFilter : ""}
                    {props.ingredientFilter != null ? " - " + props.ingredientFilter : ""}
                </Typography>
                <Box sx={{flexGrow: 1}}/>
                {props.selectedRecipeId &&
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu"
                                onClick={() => generatePDF(props.pdfProps.ref, {filename: props.pdfProps.name + '.pdf'})}
                                disabled={window.location.pathname === '/edit'}>
                        <DownloadIcon/>
                    </IconButton>
                }
                {props.selectedRecipeId &&
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={handleEditRecipe}
                                disabled={window.location.pathname === '/edit'}>
                        <EditIcon/>
                    </IconButton>
                }
                <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={handleCreateRecipe}>
                    <AddIcon/>
                </IconButton>
                <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={() => setOpenDrawer(true)}>
                    <FilterListIcon/>
                </IconButton>
                <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={handleShowAllRecipes}>
                    <MenuIcon/>
                </IconButton>
            </Toolbar>
            <SwipeableDrawer
                anchor={props.userConfig ? props.userConfig.menuAnchor : "right"}
                open={openDrawer}
                onOpen={() => {}}
                onClose={() => setOpenDrawer(false)}
                PaperProps={{style: {minWidth: '250px', backgroundColor: "rgb(221,255,208)"}}}
            >
                <RecipeMenu props={props} closeDrawer={() => setOpenDrawer(false)} flag={openDrawer}/>
            </SwipeableDrawer>
        </AppBar>
    )
}


