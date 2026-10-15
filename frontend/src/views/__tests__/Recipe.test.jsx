import React from "react";
import {fireEvent, screen, within} from "@testing-library/react";
import {useData} from "../../fetch";
import Recipe, {orderIngredients} from "../Recipe";
import {renderPage, resetScreen, setScreenWide} from "../../testUtils";

jest.mock("../../fetch", () => ({useData: jest.fn()}));

const recipe = {
    id: 2,
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
    const setShownRecipe = jest.fn();
    const view = renderPage(<Recipe/>, {path: "/recipe/:id", at: "/recipe/2", state: {setShownRecipe}});
    return {setShownRecipe, view};
}

describe("Recipe on a wide screen", () => {
    beforeEach(() => setScreenWide(true));
    afterEach(resetScreen);

    test("reads the recipe in the address", () => {
        useData.mockReturnValue({data: null, loaded: false, error: null});
        renderPage(<Recipe/>, {path: "/recipe/:id", at: "/recipe/42"});

        expect(useData).toHaveBeenCalledWith("/recipe/42");
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("heads the page with the category, the name and what it takes", () => {
        setup();

        const page = within(screen.getByRole("article", {name: "Tomato soup"}));
        expect(page.getByRole("heading", {level: 2, name: "Tomato soup"})).toBeInTheDocument();
        expect(page.getByText("Polievky")).toBeInTheDocument();
        expect(page.getByText("3 ingredients · 3 steps")).toBeInTheDocument();
    });

    test("lists the required ingredients with their quantities, the optional ones apart", () => {
        setup();

        const required = within(screen.getByRole("list", {name: "Ingredients"})).getAllByRole("listitem");
        expect(required.map((item) => item.textContent)).toEqual(["Tomatoes4 pcs", "Salt1 pinch"]);
        const optional = within(screen.getByRole("list", {name: "Optional ingredients"})).getAllByRole("listitem");
        expect(optional.map((item) => item.textContent)).toEqual(["Basil"]);
    });

    test("lists the steps in order, tagging the optional one", () => {
        setup();

        const steps = within(screen.getByRole("list", {name: "Steps"})).getAllByRole("listitem");
        expect(steps.map((step) => step.textContent)).toEqual(["1Chop", "2Boil\nfor 20 minutes", "3Garnishoptional"]);
    });

    test("says so when a recipe has no ingredients or steps yet", () => {
        setup({...recipe, ingredients: [], steps: []});

        expect(screen.getByText("No ingredients yet.")).toBeInTheDocument();
        expect(screen.getByText("No steps yet.")).toBeInTheDocument();
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
        const {setShownRecipe, view} = setup();

        expect(setShownRecipe).toHaveBeenCalledWith({ref: expect.objectContaining({current: expect.anything()}), name: "Tomato soup", category: "Polievky"});

        view.unmount();
        expect(setShownRecipe).toHaveBeenLastCalledWith(null);
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

describe("Recipe on a phone", () => {
    const setupPhone = (data = recipe) => setup(data);

    test("shows the picture with the name over it", () => {
        setupPhone({...recipe, image: "data:image/jpeg;base64,AA=="});

        const article = screen.getByRole("article", {name: "Tomato soup"});
        expect(within(article).getByRole("heading", {name: "Tomato soup"})).toBeInTheDocument();
        expect(screen.getByTestId("recipe-picture")).toHaveStyle({backgroundImage: "url(data:image/jpeg;base64,AA==)"});
    });

    test("shows just the name when there is no picture", () => {
        setupPhone();

        const article = screen.getByRole("article", {name: "Tomato soup"});
        expect(within(article).getByRole("heading", {name: "Tomato soup"})).toBeInTheDocument();
        expect(screen.queryByTestId("recipe-picture")).not.toBeInTheDocument();
    });

    test("opens on the ingredients, required first and the optional ones apart", () => {
        setupPhone();

        expect(screen.getByRole("tab", {name: "Ingredients 3"})).toHaveAttribute("aria-selected", "true");
        const required = within(screen.getByRole("list", {name: "Ingredients"})).getAllByRole("listitem");
        expect(required.map((item) => item.textContent)).toEqual(["Tomatoes4 pcs", "Salt1 pinch"]);
        const optional = within(screen.getByRole("list", {name: "Optional ingredients"})).getAllByRole("listitem");
        expect(optional.map((item) => item.textContent)).toEqual(["Basil"]);
        expect(screen.queryByRole("list", {name: "Steps"})).not.toBeInTheDocument();
    });

    test("shows the steps in order on their tab, the optional ones tagged", () => {
        setupPhone();

        fireEvent.click(screen.getByRole("tab", {name: "Steps 3"}));

        const steps = within(screen.getByRole("list", {name: "Steps"})).getAllByRole("listitem");
        expect(steps.map((step) => step.textContent)).toEqual(["1Chop", "2Boil\nfor 20 minutes", "3Garnishoptional"]);
        expect(screen.queryByRole("list", {name: "Ingredients"})).not.toBeInTheDocument();
    });

    test("says so when a recipe has no ingredients or steps yet", () => {
        setupPhone({...recipe, ingredients: [], steps: []});

        expect(screen.getByText("No ingredients yet.")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("tab", {name: "Steps 0"}));
        expect(screen.getByText("No steps yet.")).toBeInTheDocument();
    });

    test("still exports the full page, kept out of sight", () => {
        const {setShownRecipe} = setupPhone();

        const page = screen.getByTestId("pdf-page");
        expect(page).toHaveAttribute("aria-hidden", "true");
        expect(page).toHaveTextContent("Garnish");
        expect(page).toHaveTextContent("Basil");
        expect(setShownRecipe.mock.calls[0][0].ref.current).toHaveTextContent("Tomato soup");
    });
});
