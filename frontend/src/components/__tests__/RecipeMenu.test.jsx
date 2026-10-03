import React from "react";
import {fireEvent, screen, waitForElementToBeRemoved, within} from "@testing-library/react";
import {useData} from "../../fetch";
import RecipeMenu from "../RecipeMenu";
import {renderPage} from "../../testUtils";

jest.mock("../../fetch", () => ({useData: jest.fn()}));

const menu = {categories: ["Maso", "Polievky"], ingredients: ["Batatas", "Soľ & korenie"]};

function setup(open = true) {
    const onClose = jest.fn();
    renderPage(<RecipeMenu open={open} onClose={onClose}/>, {path: "*", at: "/recipe/1"});
    return {onClose};
}

describe("RecipeMenu", () => {
    beforeEach(() => useData.mockReturnValue({data: menu, loaded: true, error: null}));

    test("reads the user's menu while the drawer is open", () => {
        setup(true);
        expect(useData).toHaveBeenCalledWith("/user/Stanley/menu", true);
    });

    test("shows the loader until the menu arrives", () => {
        useData.mockReturnValue({data: null, loaded: false, error: null});
        setup();
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("shows the ingredients and keeps the categories folded", () => {
        setup();

        const ingredients = screen.getByRole("list", {name: "Ingredients"});
        expect(within(ingredients).getAllByRole("button").map((button) => button.textContent)).toEqual(["Batatas", "Soľ & korenie"]);
        expect(screen.queryByRole("list", {name: "Categories"})).not.toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Categories"})).toHaveAttribute("aria-expanded", "false");
    });

    test("filters by the picked ingredient, encoded, and closes", () => {
        const {onClose} = setup();

        fireEvent.click(screen.getByRole("button", {name: "Soľ & korenie"}));

        expect(onClose).toHaveBeenCalled();
        expect(screen.getByTestId("location")).toHaveTextContent("/?ingredient=So%C4%BE+%26+korenie");
    });

    test("opening the categories folds the ingredients, and filters by the picked one", async () => {
        setup();

        fireEvent.click(screen.getByRole("button", {name: "Categories"}));
        await waitForElementToBeRemoved(() => screen.queryByRole("list", {name: "Ingredients"}));
        fireEvent.click(within(screen.getByRole("list", {name: "Categories"})).getByRole("button", {name: "Polievky"}));

        expect(screen.getByTestId("location")).toHaveTextContent("/?category=Polievky");
    });

    test("folds the open section when clicked again", async () => {
        setup();

        fireEvent.click(screen.getByRole("button", {name: "Ingredients"}));

        await waitForElementToBeRemoved(() => screen.queryByRole("list", {name: "Ingredients"}));
        expect(screen.getByRole("button", {name: "Ingredients"})).toHaveAttribute("aria-expanded", "false");
    });
});
