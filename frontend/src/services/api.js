import axios from "axios";
import {properties} from "../properties";

const segment = encodeURIComponent

/** The backend paths the views read, each built from its parameters with every part encoded. */
export const paths = {
    users: () => "/user",
    userConfig: (user) => `/user/${segment(user)}/config`,
    menu: (user) => `/user/${segment(user)}/menu`,
    recipes: (user, {category = null, ingredient = null} = {}) => {
        const query = new URLSearchParams()
        if (category !== null) query.set("category", category)
        if (ingredient !== null) query.set("ingredient", ingredient)
        const search = query.toString()
        return `/user/${segment(user)}/recipes` + (search ? "?" + search : "")
    },
    recipe: (id) => `/recipe/${segment(id)}`,
}

/** Creates a recipe of the cook, answering it as stored - with its new ID. */
export const createRecipe = (cook, recipe) =>
    axios.post(properties.backend + "/recipe", {...recipe, cook}).then((response) => response.data)

/** Replaces the editable part of a recipe, answering it as stored. */
export const updateRecipe = (id, recipe) =>
    axios.put(properties.backend + paths.recipe(id), recipe).then((response) => response.data)
