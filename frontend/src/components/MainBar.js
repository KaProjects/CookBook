import React, {useState} from "react"
import MenuIcon from "@mui/icons-material/Menu"
import {AppBar, Box, IconButton, SwipeableDrawer, Toolbar, Typography} from "@mui/material"
import RecipeMenu from "../views/RecipeMenu";

export default function MainBar(props) {

    const [openDrawer, setOpenDrawer] = useState(false)

    return (
        <AppBar position="static">
            <Toolbar variant="dense">
                {props.userConfig && props.userConfig.menuAnchor === "left" &&
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => setOpenDrawer(true)}
                    >
                        <MenuIcon/>
                    </IconButton>
                }
                <Typography
                    variant="h6"
                    component="div"
                >
                    {props.user}'s CookBook
                    {props.categoryFilter != null ? " - " + props.categoryFilter : ""}
                    {props.ingredientFilter != null ? " - " + props.ingredientFilter : ""}
                </Typography>
                <Box sx={{flexGrow: 1}}/>
                {(!props.userConfig || props.userConfig.menuAnchor !== "left") &&
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => setOpenDrawer(true)}
                    >
                        <MenuIcon/>
                    </IconButton>
                }
            </Toolbar>
            <SwipeableDrawer
                anchor={props.userConfig ? props.userConfig.menuAnchor : "right"}
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                PaperProps={{style: {minWidth: '250px', backgroundColor: "rgb(221,255,208)"}}}
            >
                <RecipeMenu props={props} closeDrawer={() => setOpenDrawer(false)} flag={openDrawer}/>
            </SwipeableDrawer>
        </AppBar>
    )
}


