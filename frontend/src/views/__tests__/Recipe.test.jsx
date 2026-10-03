import React from "react";
import {screen, within} from "@testing-library/react";
import {useData} from "../../fetch";
import Recipe, {orderIngredients} from "../Recipe";
import {renderPage} from "../../testUtils";

jest.mock("../../fetch", () => ({useData: jest.fn()}));

const recipe = {
    id: "2",
    name: "Tomato soup",
    category: "Polievky",
    ingredients: [
        {name: "Basil", quantity: "", optional: true},
        {name: "Tomatoes", quantity: "4 pcs", optional: false},
        {name: "Salt", quantity: "1 pinch", optional: false},
    ],
    steps: [
        {number: 1, text: "Chop", optional: false},
        {number: 2, text: "Boil\nfor 20 minutes", optional: false},
        {number: 3, text: "Garnish", optional: true},
    ],
};

function setup(data = recipe) {
    useData.mockReturnValue({data, loaded: true, error: null});
    const setPdfTarget = jest.fn();
    const view = renderPage(<Recipe/>, {path: "/recipe/:id", at: "/recipe/2", state: {setPdfTarget}});
    return {setPdfTarget, view};
}

describe("Recipe", () => {
    test("reads the recipe in the address", () => {
        useData.mockReturnValue({data: null, loaded: false, error: null});
        renderPage(<Recipe/>, {path: "/recipe/:id", at: "/recipe/a%2Fb"});

        expect(useData).toHaveBeenCalledWith("/recipe/a%2Fb");
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("shows the name and the category", () => {
        setup();

        expect(screen.getByRole("heading", {name: "Tomato soup"})).toBeInTheDocument();
        expect(screen.getByRole("heading", {name: "Polievky"})).toBeInTheDocument();
    });

    test("lists the required ingredients first, with their quantities", () => {
        setup();

        const items = within(screen.getByRole("list", {name: "Ingredients"})).getAllByText(/./, {selector: "p"});
        expect(items.map((item) => item.textContent)).toEqual(["Tomatoes", "(4 pcs)", "Salt", "(1 pinch)", "Basil"]);
    });

    test("lists the steps in order, marking the optional one", () => {
        setup();

        const steps = screen.getByRole("list", {name: "Steps"});
        expect(within(steps).getByText(/Boil/)).toHaveTextContent("Boil for 20 minutes");
        expect(within(steps).getAllByTitle("optional")).toHaveLength(1);
        expect(within(steps).getAllByTitle("required")).toHaveLength(2);
    });

    test("shows the picture only when there is one", () => {
        setup();
        expect(screen.queryByRole("img", {name: "Tomato soup"})).not.toBeInTheDocument();
    });

    test("shows the picture", () => {
        setup({...recipe, image: "data:image/jpeg;base64,AA=="});
        expect(screen.getByRole("img", {name: "Tomato soup"})).toHaveAttribute("src", "data:image/jpeg;base64,AA==");
    });

    test("offers itself for PDF export while it is shown", () => {
        const {setPdfTarget, view} = setup();

        expect(setPdfTarget).toHaveBeenCalledWith({ref: expect.objectContaining({current: expect.anything()}), name: "Tomato soup"});

        view.unmount();
        expect(setPdfTarget).toHaveBeenLastCalledWith(null);
    });
});

describe("orderIngredients", () => {
    test("keeps the stored order within the required and the optional ones", () => {
        const a = {name: "a", optional: true};
        const b = {name: "b", optional: false};
        const c = {name: "c", optional: true};
        const d = {name: "d", optional: false};

        expect(orderIngredients([a, b, c, d])).toEqual([b, d, a, c]);
    });
});
