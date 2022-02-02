import React, {useState} from "react";
import {AppBar} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({

}));

const MainBar = props => {
  const classes = useStyles();

  return (
      <AppBar position="static">
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
        >
          CookBook
        </Typography>

      </AppBar>
  );
}

export default MainBar;


