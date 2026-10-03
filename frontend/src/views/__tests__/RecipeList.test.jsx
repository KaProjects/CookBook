import React from "react";
import {fireEvent, screen, within} from "@testing-library/react";
import {useData} from "../../fetch";
import RecipeList from "../RecipeList";
import {renderPage} from "../../testUtils";

jest.mock("../../fetch", () => ({useData: jest.fn()}));

const list = {
    categories: [
        {name: "Maso", recipes: [{id: "3", name: "Steak", hasImage: true, hasSteps: true}]},
        {name: "Polievky", recipes: [
            {id: "1", name: "Tomato soup", hasImage: false, hasSteps: true},
            {id: "a/b", name: "Onion soup", hasImage: true, hasSteps: false},
        ]},
    ],
};

const setup = (at = "/", state = {}) => renderPage(<RecipeList/>, {at, state});

describe("RecipeList", () => {
    beforeEach(() => useData.mockReturnValue({data: list, loaded: true, error: null}));

    test("reads the user's recipes", () => {
        setup();
        expect(useData).toHaveBeenCalledWith("/user/Stanley/recipes");
    });

    test("filters by the category or ingredient in the address", () => {
        setup("/?category=Hlavn%C3%A9%20jedl%C3%A1");
        expect(useData).toHaveBeenLastCalledWith("/user/Stanley/recipes?category=Hlavn%C3%A9+jedl%C3%A1");

        setup("/?ingredient=Batatas");
        expect(useData).toHaveBeenLastCalledWith("/user/Stanley/recipes?ingredient=Batatas");
    });

    test("shows the loader, or why the list could not be read", () => {
        useData.mockReturnValue({data: null, loaded: false, error: null});
        setup();
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("groups the recipes under their categories, in the user's colour", () => {
        setup("/", {userConfig: {menuAnchor: "right", recipeItemColor: "rgb(1, 2, 3)"}});

        const soups = screen.getByRole("region", {name: "Polievky"});
        expect(within(soups).getAllByRole("button").map((button) => button.textContent)).toEqual(["Tomato soup", "Onion soup"]);
        expect(within(screen.getByRole("region", {name: "Maso"})).getByRole("button", {name: "Steak"}))
            .toHaveStyle({backgroundColor: "rgb(1, 2, 3)"});
    });

    test("marks the recipes that have no picture or no steps", () => {
        setup();

        const steak = screen.getByRole("button", {name: "Steak"});
        expect(within(steak).queryByLabelText("No picture")).not.toBeInTheDocument();
        expect(within(steak).queryByLabelText("No steps")).not.toBeInTheDocument();
        expect(within(screen.getByRole("button", {name: /Tomato soup/})).getByLabelText("No picture")).toBeInTheDocument();
        expect(within(screen.getByRole("button", {name: /Onion soup/})).getByLabelText("No steps")).toBeInTheDocument();
    });

    test("opens the recipe clicked", () => {
        setup();

        fireEvent.click(screen.getByRole("button", {name: /Onion soup/}));

        expect(screen.getByTestId("location")).toHaveTextContent("/recipe/a%2Fb");
    });

    test("says so when there are no recipes", () => {
        useData.mockReturnValue({data: {categories: []}, loaded: true, error: null});
        setup();

        expect(screen.getByText("No recipes yet - add one with the + button.")).toBeInTheDocument();
    });
});
