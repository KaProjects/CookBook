import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useParams} from "react-router";
import axios from "axios";

const useStyles = makeStyles((theme) => ({

}));

const Recipe = props => {
  const classes = useStyles();
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);

  useEffect(async () => {
    const response = await axios.get("http://" + props.host + ":7777/recipe/"+id);
    console.log(response);
    setRecipe(response.data);
  }, []);



  return (
    <h2>aaa {id} {recipe}</h2>
  );
}

export default Recipe;