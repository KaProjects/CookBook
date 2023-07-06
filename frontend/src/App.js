import React, {Component} from 'react';
import './App.css';
import MainBar from "./components/MainBar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Recipe from "./views/Recipe";
import RecipeList from "./views/RecipeList";
import RecipeMenu from "./views/RecipeMenu";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "user",
            categoryFilter: null,
            ingredientFilter: null,
            selectedRecipeId: null,
            setSelectedRecipe: this.setSelectedRecipe.bind(this),
            showAllRecipes: this.showAllRecipes.bind(this),
            showIngredientRecipes: this.showIngredientRecipes.bind(this),
            showCategoryRecipes: this.showCategoryRecipes.bind(this),
        };
    }

    showAllRecipes() {
        this.setState({categoryFilter: null})
        this.setState({ingredientFilter: null})
    }

    showIngredientRecipes(ingredient) {
        this.setState({categoryFilter: null})
        this.setState({ingredientFilter: ingredient})
    }

    showCategoryRecipes(category) {
        this.setState({categoryFilter: category})
        this.setState({ingredientFilter: null})
    }

    setSelectedRecipe(recipeId) {
        this.setState({selectedRecipeId: recipeId});
    }

    render() {
        return (
            <BrowserRouter>
                <MainBar {...this.state} />
                <Routes>
                    <Route exact path="/" element={<RecipeList {...this.state}/>}/>
                    <Route exact path="/menu" element={<RecipeMenu {...this.state}/>}/>
                    <Route exact path="/recipe" element={<Recipe {...this.state}/>}/>
                    {/*<Route exact path="/recipe/create" element={<RecipeEditor {...this.state}/> }/>*/}
                    {/*<Route exact path="/recipe/:id/edit" element={<RecipeEditor {...this.state}/> }/>*/}
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;
