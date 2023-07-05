import React, {Component} from 'react';
import './App.css';
import axios from "axios";
import MainBar from "./components/MainBar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Recipe from "./views/Recipe";
import RecipeEditor from "./views/RecipeEditor";
import {properties} from './properties.js';
import RecipeList from "./views/RecipeList";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      host: properties.host,
      port: properties.port,
      loaded: false,
      showAllRecipes: this.showAllRecipes,
      showIngredientRecipes: this.showIngredientRecipes,
      showCategoryRecipes: this.showCategoryRecipes,
      selectedMenu: -1,
      recipes: [],
      recipe: 0,


      setSelectedRecipe: this.setSelectedRecipe.bind(this),
      selectedRecipeId: "null",
      user: "user",
      categoryFilter: null,
      ingredientFilter: null,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount = async () => {
    const response = await axios.get("http://" + this.state.host + ":" + this.state.port + "/list/user/menu");
    // console.log(response);
    this.setState({categories: response.data.categories});
    this.setState({ingredients: response.data.ingredients});
    this.setState({loaded: true})
  }

  showAllRecipes = () => async () => {
    this.setState({selectedMenu: 0})
    const response = await axios.get("http://" + this.state.host + ":" + this.state.port + "/list/user/recipe");
    // console.log(response);
    this.setState({recipes: response.data.recipes});
  }

  showIngredientRecipes = (id) => async () => {
    this.setState({selectedMenu: id})
    const response = await axios.get("http://" + this.state.host + ":" + this.state.port + "/list/user/recipe?ingredient="+id);
    // console.log(response);
    this.setState({recipes: response.data.recipes});

  }

  showCategoryRecipes = (id) => async () => {
    this.setState({selectedMenu: id})
    const response = await axios.get("http://" + this.state.host + ":" + this.state.port + "/list/user/recipe?category="+id);
    // console.log(response);
    this.setState({recipes: response.data.recipes});
  }

  setSelectedRecipe(recipeId) {
    this.setState({selectedRecipeId: recipeId});
  }

  render() {
    return (
      <div>
        <MainBar {...this.state} />
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<RecipeList {...this.state}/> }/>
            <Route exact path="/recipe" element={<Recipe {...this.state}/> }/>
            <Route exact path="/recipe/create" element={<RecipeEditor {...this.state}/> }/>
            <Route exact path="/recipe/:id/edit" element={<RecipeEditor {...this.state}/> }/>
          </Routes>
        </BrowserRouter>


      </div>
    );
  }
}


export default App;
