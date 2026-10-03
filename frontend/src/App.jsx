import React from "react";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import MainBar from "./components/MainBar";
import AppState, {useAppState} from "./state/appState";
import Login from "./views/Login";
import LoginShortcut from "./views/LoginShortcut";
import PageNotFound from "./views/PageNotFound";
import Recipe from "./views/Recipe";
import RecipeEditor from "./views/RecipeEditor";
import RecipeList from "./views/RecipeList";
import {ROUTER_FUTURE} from "./router";

const Layout = () => (
    <>
        <MainBar/>
        <Outlet/>
    </>
);

/**
 * Every page has an address of its own: the recipe being read or edited, and the filter of the
 * list, are in the URL, so a reload, a bookmark and the back button all keep them.
 */
export const Pages = () => {
    const {user} = useAppState();

    return (
        <Routes>
            <Route path="/login/:user" element={<LoginShortcut/>}/>
            {user === null
                ? <Route path="*" element={<Login/>}/>
                : <Route element={<Layout/>}>
                    <Route path="/" element={<RecipeList/>}/>
                    <Route path="/create" element={<RecipeEditor/>}/>
                    <Route path="/recipe/:id" element={<Recipe/>}/>
                    <Route path="/recipe/:id/edit" element={<RecipeEditor/>}/>
                    <Route path="*" element={<PageNotFound/>}/>
                </Route>}
        </Routes>
    );
};

const App = () => (
    <BrowserRouter future={ROUTER_FUTURE}>
        <AppState>
            <Pages/>
        </AppState>
    </BrowserRouter>
);

export default App;
