import React from "react";
import {AppBar, IconButton, Toolbar} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import {useNavigate} from "react-router";
import {Box} from "@mui/material";

const MainBar = props => {
    const navigate = useNavigate();

    const handleMenuClick = () => {
        navigate("/menu")
    };
    return (
        <AppBar position="static">
            <Toolbar variant="dense">
                <Typography
                    variant="h6"
                    component="div"
                >
                    {props.user}'s CookBook
                </Typography>
                <Box sx={{flexGrow: 1}}/>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenuClick}
                >
                    <MenuIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default MainBar;


