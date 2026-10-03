import {emptyForm, formFromRecipe, formReducer, formToRecipe, isValid, validateForm} from "../recipeForm";

const recipe = {
    id: "7",
    name: "Soup",
    category: "Polievky",
    image: "data:image/jpeg;base64,AA==",
    ingredients: [{name: "Salt", quantity: "1 pinch", optional: false}, {name: "Basil", quantity: "", optional: true}],
    steps: [{number: 2, text: "Boil", optional: false}, {number: 1, text: "Chop", optional: true}],
};

describe("formFromRecipe", () => {
    test("takes the editable fields, steps in order, every row with a key of its own", () => {
        const form = formFromRecipe(recipe);

        expect(form.name).toBe("Soup");
        expect(form.category).toBe("Polievky");
        expect(form.image).toBe(recipe.image);
        expect(form.steps.map((step) => step.text)).toEqual(["Chop", "Boil"]);
        expect(form.ingredients.map((ingredient) => ingredient.name)).toEqual(["Salt", "Basil"]);
        const keys = [...form.steps, ...form.ingredients].map((row) => row.key);
        expect(new Set(keys).size).toBe(4);
    });

    test("treats a missing image as none", () => {
        expect(formFromRecipe({...recipe, image: undefined}).image).toBeNull();
    });
});

describe("formReducer", () => {
    const base = () => formFromRecipe(recipe);

    test("sets a field without touching the rest", () => {
        const before = base();
        const after = formReducer(before, {type: "set", field: "name", value: "Stew"});

        expect(after.name).toBe("Stew");
        expect(after.steps).toBe(before.steps);
        expect(before.name).toBe("Soup");
    });

    test("adds a step below another, or first into an empty list", () => {
        const form = formReducer(base(), {type: "addStep", after: 0});
        expect(form.steps.map((step) => step.text)).toEqual(["Chop", "", "Boil"]);

        const first = formReducer(emptyForm(), {type: "addStep", after: -1});
        expect(first.steps).toHaveLength(1);
        expect(first.steps[0]).toMatchObject({text: "", optional: false});
    });

    test("changes and removes a step by its position, keeping the other rows' keys", () => {
        const before = base();
        const changed = formReducer(before, {type: "changeStep", index: 1, changes: {text: "Simmer", optional: true}});
        expect(changed.steps[1]).toMatchObject({text: "Simmer", optional: true, key: before.steps[1].key});
        expect(before.steps[1].text).toBe("Boil");

        const removed = formReducer(before, {type: "removeStep", index: 0});
        expect(removed.steps.map((step) => step.key)).toEqual([before.steps[1].key]);
    });

    test("adds, changes and removes ingredients the same way", () => {
        let form = formReducer(base(), {type: "addIngredient", after: 1});
        expect(form.ingredients).toHaveLength(3);
        form = formReducer(form, {type: "changeIngredient", index: 2, changes: {name: "Pepper"}});
        expect(form.ingredients[2].name).toBe("Pepper");
        form = formReducer(form, {type: "removeIngredient", index: 0});
        expect(form.ingredients.map((ingredient) => ingredient.name)).toEqual(["Basil", "Pepper"]);
    });

    test("is reset to a whole new form", () => {
        const replacement = emptyForm();
        expect(formReducer(base(), {type: "reset", form: replacement})).toBe(replacement);
    });

    test("refuses an action it does not know", () => {
        expect(() => formReducer(base(), {type: "explode"})).toThrow("Unknown form action: explode");
    });
});

describe("validateForm", () => {
    test("needs a name, a category, and a name and text for every row", () => {
        const form = {
            ...emptyForm(),
            name: "  ",
            ingredients: [{key: "a", name: "Salt", quantity: "", optional: false}, {key: "b", name: " ", quantity: "", optional: false}],
            steps: [{key: "c", text: "", optional: false}],
        };

        const errors = validateForm(form);

        expect(errors).toEqual({name: true, category: true, ingredients: [false, true], steps: [true]});
        expect(isValid(errors)).toBe(false);
    });

    test("accepts a complete recipe, with empty quantities and no rows at all", () => {
        expect(isValid(validateForm({...emptyForm(), name: "Soup", category: "Polievky"}))).toBe(true);
        expect(isValid(validateForm(formFromRecipe(recipe)))).toBe(true);
    });
});

describe("formToRecipe", () => {
    test("trims every text and numbers the steps in the order shown", () => {
        let form = formFromRecipe(recipe);
        form = formReducer(form, {type: "set", field: "name", value: "  Soup  "});
        form = formReducer(form, {type: "changeIngredient", index: 0, changes: {quantity: " 2 pinches "}});

        expect(formToRecipe(form)).toEqual({
            name: "Soup",
            category: "Polievky",
            image: recipe.image,
            ingredients: [{name: "Salt", quantity: "2 pinches", optional: false}, {name: "Basil", quantity: "", optional: true}],
            steps: [{number: 1, text: "Chop", optional: true}, {number: 2, text: "Boil", optional: false}],
        });
    });
});
