/**
 * The recipe editor's form, kept as plain data and changed only through {@link formReducer}, so
 * every change is a new value and the rules live here rather than in the component.
 *
 * Rows carry a key of their own. The editor used to key them by their index, so deleting the
 * first step re-rendered the second into the first one's text field, cursor and all.
 */

export const LIMITS = {name: 100, category: 100, ingredientName: 100, quantity: 30, step: 10000}

let lastKey = 0
const nextKey = () => "row-" + (++lastKey)

const ingredientRow = ({name = "", quantity = "", optional = false} = {}) => ({key: nextKey(), name, quantity, optional})
const stepRow = ({text = "", optional = false} = {}) => ({key: nextKey(), text, optional})

export const emptyForm = () => ({name: "", category: "", image: null, ingredients: [], steps: []})

/** The form for an existing recipe, its steps in their order. */
export const formFromRecipe = (recipe) => ({
    name: recipe.name,
    category: recipe.category,
    image: recipe.image ?? null,
    ingredients: recipe.ingredients.map(ingredientRow),
    steps: [...recipe.steps].sort((a, b) => a.number - b.number).map(stepRow),
})

const insertAfter = (rows, index, row) => [...rows.slice(0, index + 1), row, ...rows.slice(index + 1)]
const replaceAt = (rows, index, changes) => rows.map((row, i) => (i === index ? {...row, ...changes} : row))
const removeAt = (rows, index) => rows.filter((_, i) => i !== index)

export const formReducer = (form, action) => {
    switch (action.type) {
        case "reset":
            return action.form
        case "set":
            return {...form, [action.field]: action.value}
        case "addIngredient":
            return {...form, ingredients: insertAfter(form.ingredients, action.after, ingredientRow())}
        case "changeIngredient":
            return {...form, ingredients: replaceAt(form.ingredients, action.index, action.changes)}
        case "removeIngredient":
            return {...form, ingredients: removeAt(form.ingredients, action.index)}
        case "addStep":
            return {...form, steps: insertAfter(form.steps, action.after, stepRow())}
        case "changeStep":
            return {...form, steps: replaceAt(form.steps, action.index, action.changes)}
        case "removeStep":
            return {...form, steps: removeAt(form.steps, action.index)}
        default:
            throw new Error("Unknown form action: " + action.type)
    }
}

const blank = (value) => value === null || value === undefined || value.trim() === ""

/** What is missing, field by field and row by row; the form can be saved when nothing is. */
export const validateForm = (form) => ({
    name: blank(form.name),
    category: blank(form.category),
    ingredients: form.ingredients.map((ingredient) => blank(ingredient.name)),
    steps: form.steps.map((step) => blank(step.text)),
})

export const isValid = (errors) =>
    !errors.name && !errors.category && !errors.ingredients.some(Boolean) && !errors.steps.some(Boolean)

/** The recipe as the backend takes it, the steps numbered in the order they are shown. */
export const formToRecipe = (form) => ({
    name: form.name.trim(),
    category: form.category.trim(),
    image: form.image,
    ingredients: form.ingredients.map(({name, quantity, optional}) => ({name: name.trim(), quantity: quantity.trim(), optional})),
    steps: form.steps.map(({text, optional}, index) => ({number: index + 1, text: text.trim(), optional})),
})
