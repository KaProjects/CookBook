import React from "react";
import {AppBar, Link} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  menuList: {
    paddingLeft: theme.spacing(2),
  }
}));

const MainBar = props => {
  const classes = useStyles();

  return (
      <AppBar position="static">
        <Link href="/" underline="none" color="inherit">
          <Typography
            className={classes.menuList}
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            CookBook
          </Typography>
        </Link>


      </AppBar>
  );
}

export default MainBar;


