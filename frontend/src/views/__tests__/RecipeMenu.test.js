import React from "react";
import {fireEvent, render, screen, waitForElementToBeRemoved} from "@testing-library/react";
import {MemoryRouter, Route, Routes, useLocation} from "react-router-dom";
import {useData} from "../../fetch";
import RecipeMenu from "../RecipeMenu";

jest.mock("../../fetch", () => ({useData: jest.fn()}));

function LocationDisplay() {
    return <div data-testid="location">{useLocation().pathname}</div>;
}

function setupMenu() {
    const appProps = {
        user: "Stanley",
        showIngredientRecipes: jest.fn(),
        showCategoryRecipes: jest.fn(),
    };
    const closeDrawer = jest.fn();
    render(
        <MemoryRouter initialEntries={["/recipe"]}>
            <RecipeMenu props={appProps} closeDrawer={closeDrawer} flag={true}/>
            <Routes><Route path="*" element={<LocationDisplay/>}/></Routes>
        </MemoryRouter>
    );
    return {appProps, closeDrawer};
}

const names = (elements) => elements.map(element => element.textContent);

describe("RecipeMenu", () => {
    beforeEach(() => {
        useData.mockReset();
        useData.mockReturnValue({
            data: {ingredients: ["Pomodoro", "Batatas", "Kachnicka"], categories: ["Polievky", "Maso"]},
            loaded: true,
            error: null,
        });
    });

    test("refetches the menu each time the drawer opens", () => {
        setupMenu();
        expect(useData).toHaveBeenCalledWith("/list/Stanley/menu", true);
    });

    test("shows the loader until the menu arrives", () => {
        useData.mockReturnValue({data: null, loaded: false, error: null});
        setupMenu();
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("lists ingredients alphabetically and keeps categories collapsed", () => {
        setupMenu();

        const buttons = names(screen.getAllByRole("button"));
        expect(buttons).toEqual(["Ingredients", "Batatas", "Kachnicka", "Pomodoro", "Categories"]);
    });

    test("filters by the clicked ingredient", () => {
        const {appProps, closeDrawer} = setupMenu();

        fireEvent.click(screen.getByRole("button", {name: "Batatas"}));

        expect(appProps.showIngredientRecipes).toHaveBeenCalledWith("Batatas");
        expect(closeDrawer).toHaveBeenCalled();
        expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    });

    test("expands categories and filters by the clicked one", () => {
        const {appProps, closeDrawer} = setupMenu();

        fireEvent.click(screen.getByRole("button", {name: "Categories"}));
        expect(names(screen.getAllByRole("button")).slice(-2)).toEqual(["Maso", "Polievky"]);

        fireEvent.click(screen.getByRole("button", {name: "Maso"}));

        expect(appProps.showCategoryRecipes).toHaveBeenCalledWith("Maso");
        expect(closeDrawer).toHaveBeenCalled();
        expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    });

    test("collapses ingredients", async () => {
        setupMenu();

        fireEvent.click(screen.getByRole("button", {name: "Ingredients"}));

        await waitForElementToBeRemoved(() => screen.queryByRole("button", {name: "Batatas"}));
        expect(screen.getAllByTestId("ExpandMoreIcon")).toHaveLength(2);
    });
});
