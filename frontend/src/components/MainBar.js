import React from "react";
import {AppBar, IconButton, Toolbar} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import MenuIcon from '@mui/icons-material/Menu';

const MainBar = props => {

  return (
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
              variant="h6"
              noWrap
              component="div"
          >
            CookBook
          </Typography>


        </Toolbar>
      </AppBar>
  );
}

export default MainBar;


