import React from "react";
import {fireEvent, screen, within} from "@testing-library/react";
import {useData} from "../../fetch";
import RecipeList from "../RecipeList";
import {renderPage, resetScreen, setScreenWide} from "../../testUtils";

jest.mock("../../fetch", () => ({useData: jest.fn()}));

const list = {
    categories: [
        {name: "Maso", recipes: [{id: 3, name: "Steak", hasImage: true, hasSteps: true}]},
        {name: "Polievky", recipes: [
            {id: 1, name: "Tomato soup", hasImage: false, hasSteps: true},
            {id: 12, name: "Onion soup", hasImage: true, hasSteps: false},
        ]},
    ],
};

const setup = (at = "/", state = {}) => renderPage(<RecipeList/>, {at, state});

describe("RecipeList", () => {
    afterEach(resetScreen);

    beforeEach(() => {
        setScreenWide(true);
        useData.mockReturnValue({data: list, loaded: true, error: null});
    });

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

    test("groups the recipes under their categories, with how many there are", () => {
        setup();

        const soups = screen.getByRole("region", {name: "Polievky"});
        expect(within(soups).getByRole("heading", {name: "Polievky"})).toBeInTheDocument();
        expect(within(soups).getByText("2 recipes")).toBeInTheDocument();
        expect(within(soups).getAllByRole("button").map((button) => button.textContent)).toEqual(["TTomato soup", "No steps yetOnion soup"]);
        expect(within(screen.getByRole("region", {name: "Maso"})).getByText("1 recipe")).toBeInTheDocument();
    });

    test("shows a recipe's thumbnail, or its initial on a tint of the user's colour", () => {
        const {container} = setup("/", {userConfig: {menuAnchor: "right", recipeItemColor: "rgb(1, 2, 3)"}});

        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        expect([...container.querySelectorAll("img")].map((img) => img.getAttribute("src")))
            .toEqual([expect.stringMatching(/\/recipe\/3\/image\?size=thumbnail$/), expect.stringMatching(/\/recipe\/12\/image\?size=thumbnail$/)]);
        expect(within(screen.getByRole("button", {name: /Tomato soup/})).getByText("T")).toHaveStyle({backgroundColor: "rgba(1, 2, 3, 0.3)"});
    });

    test("opens the recipe clicked", () => {
        setup();

        fireEvent.click(screen.getByRole("button", {name: /Onion soup/}));

        expect(screen.getByTestId("location")).toHaveTextContent("/recipe/12");
    });

    test("says so when there are no recipes", () => {
        useData.mockReturnValue({data: {categories: []}, loaded: true, error: null});
        setup();

        expect(screen.getByText("No recipes yet - add one with the + button.")).toBeInTheDocument();
    });

    test("on a phone, reads every category, whichever is open", () => {
        setScreenWide(false);
        setup("/?category=Maso&ingredient=Batatas");

        expect(useData).toHaveBeenLastCalledWith("/user/Stanley/recipes?ingredient=Batatas");
        expect(screen.getByRole("region", {name: "Maso"})).toBeInTheDocument();
    });
});
