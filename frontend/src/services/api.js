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

/** Where an <img> loads a recipe's picture from, as stored or scaled down to a thumbnail. */
export const imageUrl = (id, {thumbnail = false} = {}) =>
    properties.backend + paths.recipe(id) + "/image" + (thumbnail ? "?size=thumbnail" : "")

/** Creates a recipe of the cook, answering it as stored - with its new ID. */
export const createRecipe = (cook, recipe) =>
    axios.post(properties.backend + "/recipe", {...recipe, cook}).then((response) => response.data)

/** Deletes a recipe with its steps, ingredients and picture. */
export const deleteRecipe = (id) =>
    axios.delete(properties.backend + paths.recipe(id)).then(() => undefined)

/** Replaces the editable part of a recipe, answering it as stored. */
export const updateRecipe = (id, recipe) =>
    axios.put(properties.backend + paths.recipe(id), recipe).then((response) => response.data)
