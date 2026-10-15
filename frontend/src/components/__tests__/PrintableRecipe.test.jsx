import React from "react";
import {render, screen, within} from "@testing-library/react";
import PrintableRecipe, {shiftToNextPage} from "../PrintableRecipe";

const recipe = {
    name: "Tomato soup",
    category: "Polievky",
    image: "data:image/jpeg;base64,AA==",
    ingredients: [
        {name: "Basil", quantity: "", optional: true},
        {name: "Tomatoes", quantity: "4 pcs", optional: false},
    ],
    steps: [
        {number: 1, text: "Chop", optional: false},
        {number: 2, text: "Garnish", optional: true},
    ],
};

const show = (overrides = {}) => render(<PrintableRecipe recipe={{...recipe, ...overrides}} cook="Stanley" pageRef={{current: null}}/>);

describe("PrintableRecipe", () => {
    test("heads the page with the category, the name and what it takes", () => {
        show();

        expect(screen.getByText("Polievky")).toBeInTheDocument();
        expect(screen.getByRole("heading", {level: 1, name: "Tomato soup"})).toBeInTheDocument();
        expect(screen.getByText("2 ingredients · 2 steps")).toBeInTheDocument();
    });

    test("lists the required ingredients before the optional ones", () => {
        show();

        const [required, optional] = screen.getAllByRole("list").filter((list) => list.tagName === "UL");
        expect(within(required).getByRole("listitem")).toHaveTextContent("Tomatoes4 pcs");
        expect(within(optional).getByRole("listitem")).toHaveTextContent("Basil");
        expect(screen.getByText("Optional")).toBeInTheDocument();
    });

    test("numbers the steps and tags the optional ones", () => {
        show();

        const steps = within(screen.getAllByRole("list").find((list) => list.tagName === "OL")).getAllByRole("listitem");
        expect(steps.map((step) => step.textContent)).toEqual(["1Chop", "2Garnishoptional"]);
    });

    test("ends with the picture and whose cookbook it is from", () => {
        show();

        expect(screen.getByRole("img", {name: "Tomato soup"})).toHaveAttribute("src", recipe.image);
        expect(screen.getByText("Stanley's CookBook")).toBeInTheDocument();
    });

    test("prints without a picture, ingredients or steps", () => {
        show({image: null, ingredients: [], steps: []});

        expect(screen.queryByRole("img")).not.toBeInTheDocument();
        expect(screen.getByText("No ingredients.")).toBeInTheDocument();
        expect(screen.getByText("No steps.")).toBeInTheDocument();
        expect(screen.getByText("0 ingredients · 0 steps")).toBeInTheDocument();
    });

    test("moves a picture that a page cut would run through to the next page", () => {
        expect(shiftToNextPage(100, 300, 1000)).toBe(0);
        expect(shiftToNextPage(700, 300, 1000)).toBe(0);
        expect(shiftToNextPage(800, 300, 1000)).toBe(200);
        expect(shiftToNextPage(1900, 300, 1000)).toBe(100);
        expect(shiftToNextPage(800, 1200, 1000)).toBe(0);
    });
});
