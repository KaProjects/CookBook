import React, {Component} from 'react'
import MainBar from "./components/MainBar"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Recipe from "./views/Recipe"
import RecipeList from "./views/RecipeList"
import Login from "./views/Login"
import RecipeEditor from "./views/RecipeEditor"
import LoginShortcut from "./views/LoginShortcut";
import axios from "axios";
import {properties} from "./properties";

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: sessionStorage.getItem('user'),
            userConfig: null,
            categoryFilter: null,
            ingredientFilter: null,
            selectedRecipeId: sessionStorage.getItem('recipe'),
            setSelectedRecipe: this.setSelectedRecipe.bind(this),
            showAllRecipes: this.showAllRecipes.bind(this),
            showIngredientRecipes: this.showIngredientRecipes.bind(this),
            showCategoryRecipes: this.showCategoryRecipes.bind(this),
            setPdfProps: this.setPdfProps.bind(this),
            pdfProps: {},
        }

        this.setUser = this.setUser.bind(this)
        this.PageNotFound = this.PageNotFound.bind(this)
        this.fetchUserConfig = this.fetchUserConfig.bind(this)

        // to avoid 2 concurrent fetches when using login shortcut
        if (!window.location.href.includes("/login/")){
            this.fetchUserConfig(this.state.user)
        }
    }

    setPdfProps(ref, name) {
        this.setState({pdfProps: {ref: ref, name: name.replaceAll(" ", "_")}})
    }

    showAllRecipes() {
        this.setSelectedRecipe(null)
        this.setState({categoryFilter: null})
        this.setState({ingredientFilter: null})
    }

    showIngredientRecipes(ingredient) {
        this.setSelectedRecipe(null)
        this.setState({categoryFilter: null})
        this.setState({ingredientFilter: ingredient})
    }

    showCategoryRecipes(category) {
        this.setSelectedRecipe(null)
        this.setState({categoryFilter: category})
        this.setState({ingredientFilter: null})
    }

    setSelectedRecipe(recipeId) {
        if (recipeId == null){
            sessionStorage.removeItem('recipe')
        } else {
            sessionStorage.setItem('recipe', recipeId)
        }
        this.setState({selectedRecipeId: recipeId})
    }

    fetchUserConfig(user) {
        if (user) {
            axios.get("http://" + properties.host + ":" + properties.port + "/user/" + user + "/config")
                .then((response) => {
                    this.setState({userConfig: response.data})
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({userConfig: null})
                })
        } else {
            this.setState({userConfig: null})

        }
    }

    setUser(user){
        if (user == null){
            sessionStorage.removeItem('user')
        } else {
            sessionStorage.setItem('user', user)
        }
        this.setState({user: user})
        this.fetchUserConfig(user)
    }

    PageNotFound() {
        return (
            <div style={{position: "absolute", top: "25%", left: "50%", transform: "translate(-50%, -50%)"}}>
                <h2>404 Page not found</h2>
            </div>
        );
    }

    render() {
        if (!this.state.user) {
            return (
                <BrowserRouter>
                    <Routes>
                        <Route exact path="/" element={<Login setUser={this.setUser}/>}/>
                        <Route exact path="/login/:user" element={<LoginShortcut setUser={this.setUser}/>}/>
                        <Route path="*" element={this.PageNotFound()} />
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
                    <Route path="*" element={this.PageNotFound()} />
                </Routes>
            </BrowserRouter>
        )
    }
}

export default App
