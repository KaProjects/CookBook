import React from "react";
import {fireEvent, screen} from "@testing-library/react";
import generatePDF from "react-to-pdf";
import MainBar from "../MainBar";
import {renderPage, resetScreen, setScreenWide} from "../../testUtils";

jest.mock("react-to-pdf", () => ({
    __esModule: true,
    default: jest.fn(),
    Margin: {MEDIUM: 10},
    Resolution: {HIGH: 3},
}));
jest.mock("../DeleteRecipeDialog", () => {
    const DeleteRecipeDialog = ({open, recipeId, recipeName}) =>
        <div>delete dialog {open ? "open" : "closed"} for {recipeId} {recipeName}</div>;
    return DeleteRecipeDialog;
});
jest.mock("../RecipeMenu", () => {
    const RecipeMenu = ({open}) => <div>recipe menu {open ? "open" : "closed"}</div>;
    return RecipeMenu;
});

const setup = (at, state = {}) => renderPage(<MainBar/>, {path: "*", at, state});

describe("MainBar", () => {
    beforeEach(() => generatePDF.mockReset());

    test("names whose cookbook it is", () => {
        setup("/");
        expect(screen.getByRole("heading", {name: "Stanley's CookBook"})).toBeInTheDocument();
    });

    describe("the way back to all recipes", () => {
        const comesBefore = (first, second) =>
            Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);

        afterEach(resetScreen);

        test("leads the bar on a wide screen", () => {
            setScreenWide(true);
            setup("/");

            const allRecipes = screen.getByRole("button", {name: "All recipes"});
            expect(comesBefore(allRecipes, screen.getByRole("heading", {name: "Stanley's CookBook"}))).toBe(true);
            expect(screen.getAllByRole("button", {name: "All recipes"})).toHaveLength(1);
        });

        test("stays at the right end on a narrow screen", () => {
            setScreenWide(false);
            setup("/");

            const allRecipes = screen.getByRole("button", {name: "All recipes"});
            expect(comesBefore(screen.getByRole("button", {name: "Filter recipes"}), allRecipes)).toBe(true);
            expect(comesBefore(screen.getByRole("heading", {name: "Stanley's CookBook"}), allRecipes)).toBe(true);
        });
    });

    test("names the active filter on a wide screen", () => {
        setScreenWide(true);
        setup("/?category=Polievky");
        expect(screen.getByRole("heading", {name: "Stanley's CookBook - Polievky"})).toBeInTheDocument();
        resetScreen();
    });

    test("names the category instead of the cookbook on a phone", () => {
        setup("/?category=Polievky");
        expect(screen.getByRole("heading", {name: "Polievky"})).toBeInTheDocument();
    });

    test("names the shown recipe's category on a phone", () => {
        setup("/recipe/7", {shownRecipe: {ref: {current: null}, name: "Soup", category: "Polievky"}});
        expect(screen.getByRole("heading", {name: "Polievky"})).toBeInTheDocument();
    });

    test("names the cookbook on a phone when no category is open", () => {
        setup("/?ingredient=Soľ");
        expect(screen.getByRole("heading", {name: "Stanley's CookBook - Soľ"})).toBeInTheDocument();
    });

    test("offers the recipe actions only on a recipe", () => {
        setup("/");
        expect(screen.queryByRole("button", {name: "Edit recipe"})).not.toBeInTheDocument();
        expect(screen.queryByRole("button", {name: "Download PDF"})).not.toBeInTheDocument();
        expect(screen.queryByRole("button", {name: "Delete recipe"})).not.toBeInTheDocument();
    });

    test("asks to delete the recipe being read", () => {
        setup("/recipe/7", {shownRecipe: {ref: {current: null}, name: "Soup"}});
        expect(screen.getByText("delete dialog closed for 7 Soup")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", {name: "Delete recipe"}));

        expect(screen.getByText("delete dialog open for 7 Soup")).toBeInTheDocument();
    });

    test("edits the recipe being read", () => {
        setup("/recipe/12");

        fireEvent.click(screen.getByRole("button", {name: "Edit recipe"}));

        expect(screen.getByTestId("location")).toHaveTextContent("/recipe/12/edit");
    });

    test("downloads the recipe page as a PDF named after the recipe", () => {
        const target = {ref: {current: null}, name: "Tomato soup"};
        setup("/recipe/1", {shownRecipe: target});

        fireEvent.click(screen.getByRole("button", {name: "Download PDF"}));

        expect(generatePDF).toHaveBeenCalledWith(target.ref, {filename: "Tomato_soup.pdf", resolution: 3, page: {format: "A4", margin: 10}});
    });

    test("has no download until the recipe has loaded", () => {
        setup("/recipe/1");
        expect(screen.queryByRole("button", {name: "Download PDF"})).not.toBeInTheDocument();
    });

    test("opens a new recipe, and the whole list", () => {
        setup("/?category=Polievky");

        fireEvent.click(screen.getByRole("button", {name: "New recipe"}));
        expect(screen.getByTestId("location")).toHaveTextContent("/create");

        fireEvent.click(screen.getByRole("button", {name: "All recipes"}));
        expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    });

    test.each(["/recipe/7", "/recipe/7/edit", "/create"])("offers neither a new recipe nor the filter at %s", (at) => {
        setup(at);

        expect(screen.queryByRole("button", {name: "New recipe"})).not.toBeInTheDocument();
        expect(screen.queryByRole("button", {name: "Filter recipes"})).not.toBeInTheDocument();
        expect(screen.getByRole("button", {name: "All recipes"})).toBeInTheDocument();
    });

    test("offers a new recipe and the filter on the list", () => {
        setup("/?category=Polievky");

        expect(screen.getByRole("button", {name: "New recipe"})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Filter recipes"})).toBeInTheDocument();
    });

    test("opens the filter drawer", () => {
        setup("/");
        expect(screen.queryByText("recipe menu open")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", {name: "Filter recipes"}));

        expect(screen.getByText("recipe menu open")).toBeInTheDocument();
    });
});
