import React from "react";
import {AppBar, Box, Divider, IconButton, Link, Toolbar} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import AddBoxIcon from '@mui/icons-material/AddBox';

const useStyles = makeStyles((theme) => ({
  menuList: {
    paddingLeft: theme.spacing(2),
  }
}));

const MainBar = props => {
  const classes = useStyles();

  return (
      <AppBar position="static">
        <Toolbar variant="dense">

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
            >
              <Link href="/" underline="none" color="inherit">
                CookBook
              </Link>
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              color="inherit"
              aria-label="menu"
            >
              <Link href="/recipe/create" underline="none" color="inherit">
                <AddBoxIcon />
              </Link>
            </IconButton>
          </Box>


        </Toolbar>
      </AppBar>
  );
}

export default MainBar;


