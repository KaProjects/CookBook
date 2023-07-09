import React, {Component} from 'react'
import MainBar from "./components/MainBar"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Recipe from "./views/Recipe"
import RecipeList from "./views/RecipeList"
import Login from "./views/Login"
import RecipeEditor from "./views/RecipeEditor"
import LoginShortcut from "./views/LoginShortcut";

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null,
            categoryFilter: null,
            ingredientFilter: null,
            selectedRecipeId: null,
            setSelectedRecipe: this.setSelectedRecipe.bind(this),
            showAllRecipes: this.showAllRecipes.bind(this),
            showIngredientRecipes: this.showIngredientRecipes.bind(this),
            showCategoryRecipes: this.showCategoryRecipes.bind(this),
        }
        this.setUser = this.setUser.bind(this)
        this.getUser = this.getUser.bind(this)
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
        this.setState({selectedRecipeId: recipeId})
    }

    setUser(user){
        if (user == null){
            sessionStorage.removeItem('user')
        } else {
            sessionStorage.setItem('user', user)
        }
        this.setState({user: user})
    }

    getUser() {
        if (this.state.user != null) {
            return this.state.user
        } else {
            if (sessionStorage.getItem('user') != null){
                this.setState({user: sessionStorage.getItem('user')})
            }
            return sessionStorage.getItem('user')
        }
    }

    render() {
        if (!this.getUser()) {
            return (
                <BrowserRouter>
                <Login setUser={this.setUser}/>
                    <Routes>
                        <Route exact path="/login/:user" element={<LoginShortcut setUser={this.setUser}/>}/>
                    </Routes>
                </BrowserRouter>
            )
        }

        return (
            <BrowserRouter>
                <MainBar {...this.state} />
                <Routes>
                    <Route exact path="/login/:user" element={<LoginShortcut setUser={this.setUser}/>}/>
                    <Route exact path="/" element={<RecipeList {...this.state}/>}/>
                    <Route exact path="/recipe" element={<Recipe {...this.state}/>}/>
                    <Route exact path="/create" element={<RecipeEditor {...this.state}/> }/>
                    <Route exact path="/edit" element={<RecipeEditor {...this.state}/> }/>
                </Routes>
            </BrowserRouter>
        )
    }
}

export default App
