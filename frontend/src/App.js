import React, {Component} from 'react';
import './App.css';
import axios from "axios";
import MainBar from "./MainBar";
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import Menu from "./Menu";
import Recipe from "./Recipe";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      host: "10.0.0.7",
      loaded: false,
      showAllRecipes: this.showAllRecipes,
      showIngredientRecipes: this.showIngredientRecipes,
      showCategoryRecipes: this.showCategoryRecipes,
      loadRecipe: this.loadRecipe,
      selectedMenu: -1,
      recipes: [],
      recipe: 0,
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

  showIngredientRecipes = (id) => async () => {
    this.setState({selectedMenu: id})
    const response = await axios.get("http://" + this.state.host + ":7777/list/recipe/ingredient/"+id);
    // console.log(response);
    this.setState({recipes: response.data.recipes});

  }

  showCategoryRecipes = (id) => async () => {
    this.setState({selectedMenu: id})
    const response = await axios.get("http://" + this.state.host + ":7777/list/recipe/category/"+id);
    // console.log(response);
    this.setState({recipes: response.data.recipes});
  }

  loadRecipe = (recipee) =>  () => {
    this.setState({recipe: recipee});
  }

  render() {
    return (
      <div>
        <MainBar {...this.state} />
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Menu {...this.state}/> }/>
            <Route exact path="/recipe/:id" element={<Recipe {...this.state}/> }/>
          </Routes>
        </BrowserRouter>


      </div>
    );
  }
}


export default App;
