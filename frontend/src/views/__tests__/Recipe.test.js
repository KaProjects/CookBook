import React from "react";
import {render, screen} from "@testing-library/react";
import {useData} from "../../fetch";
import Recipe from "../Recipe";

jest.mock("../../fetch", () => ({useData: jest.fn()}));

const recipe = {
    id: "2",
    name: "Tomato soup",
    category: "Polievky",
    image: null,
    ingredients: [
        {name: "Basil", quantity: "", optional: true},
        {name: "Tomatoes", quantity: "4ks", optional: false},
        {name: "Salt", quantity: "1 pinch", optional: false},
    ],
    steps: [
        {number: 2, text: "Boil", optional: false},
        {number: 1, text: "Chop", optional: false},
        {number: 3, text: "Garnish", optional: true},
    ],
};

function setupRecipe(data = recipe) {
    useData.mockReturnValue({data, loaded: true, error: null});
    const props = {selectedRecipeId: "2", setPdfProps: jest.fn()};
    render(<Recipe {...props}/>);
    return props;
}

describe("Recipe", () => {
    beforeEach(() => useData.mockReset());

    test("requests the selected recipe", () => {
        useData.mockReturnValue({data: null, loaded: false, error: null});

        render(<Recipe selectedRecipeId="2" setPdfProps={jest.fn()}/>);

        expect(useData).toHaveBeenCalledWith("/recipe/2");
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("shows name and category", () => {
        setupRecipe();

        expect(screen.getByRole("heading", {name: "Tomato soup"})).toBeInTheDocument();
        expect(screen.getByRole("heading", {name: "Polievky"})).toBeInTheDocument();
    });

    test("lists mandatory ingredients before optional ones, with quantities", () => {
        setupRecipe();
        const text = screen.getAllByRole("list")[0].textContent;

        expect(text.indexOf("Tomatoes")).toBeLessThan(text.indexOf("Basil"));
        expect(text.indexOf("Salt")).toBeLessThan(text.indexOf("Basil"));
        expect(text).toContain("(4ks)");
        expect(text).toContain("(1 pinch)");
        expect(text).not.toContain("()");
    });

    test("orders steps by number", () => {
        setupRecipe();
        const text = screen.getAllByRole("list")[1].textContent;

        expect(text.indexOf("Chop")).toBeLessThan(text.indexOf("Boil"));
        expect(text.indexOf("Boil")).toBeLessThan(text.indexOf("Garnish"));
    });

    test("marks optional steps and ingredients", () => {
        setupRecipe();

        expect(screen.getAllByTestId("NotListedLocationIcon")).toHaveLength(2);
        expect(screen.getAllByTestId("DiamondIcon")).toHaveLength(2);
        expect(screen.getAllByTestId("AutoFixHighIcon")).toHaveLength(2);
    });

    test("shows the image only when there is one", () => {
        setupRecipe();
        expect(screen.queryByRole("img", {name: "recipe"})).not.toBeInTheDocument();
    });

    test("shows the recipe image", () => {
        setupRecipe({...recipe, image: "data:image/jpeg;base64,AA=="});
        expect(screen.getByRole("img", {name: "recipe"})).toHaveAttribute("src", "data:image/jpeg;base64,AA==");
    });

    test("registers itself for PDF export", () => {
        const props = setupRecipe();

        expect(props.setPdfProps).toHaveBeenCalledWith(expect.objectContaining({current: expect.anything()}), "Tomato soup");
    });
});
