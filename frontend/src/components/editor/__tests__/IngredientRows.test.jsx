import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import IngredientRows from "../IngredientRows";

const ingredients = [
    {key: "a", name: "Salt", quantity: "1 pinch", optional: false},
    {key: "b", name: "Basil", quantity: "", optional: true},
];

function setup(rows = ingredients) {
    const dispatch = jest.fn();
    render(<IngredientRows ingredients={rows} options={["Salt", "Pepper"]} dispatch={dispatch}/>);
    return dispatch;
}

describe("IngredientRows", () => {
    test("offers to add the first ingredient", () => {
        const dispatch = setup([]);

        fireEvent.click(screen.getByRole("button", {name: "Add ingredient"}));

        expect(dispatch).toHaveBeenCalledWith({type: "addIngredient", after: -1});
    });

    test("shows each ingredient with its quantity", () => {
        setup();

        expect(screen.getByRole("combobox", {name: "Ingredient 1"})).toHaveValue("Salt");
        expect(screen.getByRole("textbox", {name: "Quantity of ingredient 1"})).toHaveValue("1 pinch");
        expect(screen.getByRole("combobox", {name: "Ingredient 2"})).toHaveValue("Basil");
    });

    test("changes a name and a quantity", () => {
        const dispatch = setup();

        fireEvent.change(screen.getByRole("textbox", {name: "Quantity of ingredient 2"}), {target: {value: "a few leaves"}});
        expect(dispatch).toHaveBeenCalledWith({type: "changeIngredient", index: 1, changes: {quantity: "a few leaves"}});

        const name = screen.getByRole("combobox", {name: "Ingredient 1"});
        fireEvent.change(name, {target: {value: "Pep"}});
        fireEvent.click(screen.getByRole("option", {name: "Pepper"}));
        expect(dispatch).toHaveBeenCalledWith({type: "changeIngredient", index: 0, changes: {name: "Pepper"}});
    });

    test("toggles, deletes and adds below a row", () => {
        const dispatch = setup();

        expect(screen.getByRole("button", {name: "ingredient 1 is required"})).toHaveAttribute("aria-pressed", "true");
        fireEvent.click(screen.getByRole("button", {name: "ingredient 2 is optional"}));
        expect(dispatch).toHaveBeenCalledWith({type: "changeIngredient", index: 1, changes: {optional: false}});

        fireEvent.click(screen.getByRole("button", {name: "Delete ingredient 1"}));
        expect(dispatch).toHaveBeenCalledWith({type: "removeIngredient", index: 0});

        fireEvent.click(screen.getByRole("button", {name: "Add below ingredient 1"}));
        expect(dispatch).toHaveBeenCalledWith({type: "addIngredient", after: 0});
    });
});
