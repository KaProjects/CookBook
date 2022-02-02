import React, {Component, useState} from 'react';
import './App.css';
import MainMenu from "./MainMenu";
import {CircularProgress} from "@material-ui/core";
import axios from "axios";
import MainBar from "./MainBar";
import RecipeList from "./RecipeList";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      host: "10.0.0.7",
      loaded: false,
      showAllRecipes: this.showAllRecipes,
      showIngredientRecipes: this.showIngredientRecipes,
      showCategoryRecipes: this.showCategoryRecipes,
      selectedMenu: -1,
      recipes: [],

    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount = async () => {
    const response = await axios.get("http://" + this.state.host + ":7777/list/menu");
    // console.log(response);
    this.setState({categories: response.data.categories});
    this.setState({ingredients: response.data.ingredients});
    this.setState({loaded: true})
  }

  showAllRecipes = () => async () => {
    this.setState({selectedMenu: 0})
    const response = await axios.get("http://" + this.state.host + ":7777/list/recipe/all");
    // console.log(response);
    this.setState({recipes: response.data.recipes});
  }

  showIngredientRecipes = (id) => async (event) => {
    this.setState({selectedMenu: id})
    const response = await axios.get("http://" + this.state.host + ":7777/list/recipe/ingredient/"+id);
    // console.log(response);
    this.setState({recipes: response.data.recipes});

  }

  showCategoryRecipes = (id) => async (event) => {
    this.setState({selectedMenu: id})
    const response = await axios.get("http://" + this.state.host + ":7777/list/recipe/category/"+id);
    // console.log(response);
    this.setState({recipes: response.data.recipes});
  }

  render() {
    return (
      <div>
        <MainBar {...this.state} />
        {!this.state.loaded &&
          <div style={{ position: "absolute", top: "50%", left: "50%"}}>
            <CircularProgress />
          </div>
        }
        {this.state.loaded &&
          <div>
            <MainMenu {...this.state} />
            <RecipeList {...this.state} />
          </div>
        }


      </div>
    );
  }
}


export default App;
