import React, {useState} from "react"
import {AppBar, IconButton, Toolbar} from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import MenuIcon from "@mui/icons-material/Menu"
import {Box, SwipeableDrawer} from "@mui/material"
import RecipeMenu from "../views/RecipeMenu";

export default function MainBar(props) {

    const [openDrawer, setOpenDrawer] = useState(false)

    return (
        <AppBar position="static">
            <Toolbar variant="dense">
                <Typography
                    variant="h6"
                    component="div"
                >
                    {props.user}'s CookBook
                    {props.categoryFilter != null ? " - " + props.categoryFilter : ""}
                    {props.ingredientFilter != null ? " - " + props.ingredientFilter : ""}
                </Typography>
                <Box sx={{flexGrow: 1}}/>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={() => setOpenDrawer(true)}
                >
                    <MenuIcon/>
                </IconButton>
            </Toolbar>
            <SwipeableDrawer
                anchor="right"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                PaperProps={{style: {minWidth: '250px', backgroundColor: "rgb(221,255,208)"}}}
            >
                <RecipeMenu props={props} closeDrawer={() => setOpenDrawer(false)}/>
            </SwipeableDrawer>
        </AppBar>
    )
}


