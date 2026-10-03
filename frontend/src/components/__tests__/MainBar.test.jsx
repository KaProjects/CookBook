import React from "react";
import {fireEvent, screen} from "@testing-library/react";
import generatePDF from "react-to-pdf";
import MainBar from "../MainBar";
import {renderPage} from "../../testUtils";

jest.mock("react-to-pdf", () => jest.fn());
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

    test("names the active filter", () => {
        setup("/?category=Polievky");
        expect(screen.getByRole("heading", {name: "Stanley's CookBook - Polievky"})).toBeInTheDocument();
    });

    test("offers the recipe actions only on a recipe", () => {
        setup("/");
        expect(screen.queryByRole("button", {name: "Edit recipe"})).not.toBeInTheDocument();
        expect(screen.queryByRole("button", {name: "Download PDF"})).not.toBeInTheDocument();
    });

    test("edits the recipe being read", () => {
        setup("/recipe/a%20b");

        fireEvent.click(screen.getByRole("button", {name: "Edit recipe"}));

        expect(screen.getByTestId("location")).toHaveTextContent("/recipe/a%20b/edit");
    });

    test("downloads the recipe page as a PDF named after the recipe", () => {
        const target = {ref: {current: null}, name: "Tomato soup"};
        setup("/recipe/1", {pdfTarget: target});

        fireEvent.click(screen.getByRole("button", {name: "Download PDF"}));

        expect(generatePDF).toHaveBeenCalledWith(target.ref, {filename: "Tomato_soup.pdf"});
    });

    test("has no download until the recipe has loaded", () => {
        setup("/recipe/1");
        expect(screen.queryByRole("button", {name: "Download PDF"})).not.toBeInTheDocument();
    });

    test("opens a new recipe, and the whole list", () => {
        setup("/recipe/1?x=y");

        fireEvent.click(screen.getByRole("button", {name: "New recipe"}));
        expect(screen.getByTestId("location")).toHaveTextContent("/create");

        fireEvent.click(screen.getByRole("button", {name: "All recipes"}));
        expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    });

    test("opens the filter drawer", () => {
        setup("/");
        expect(screen.queryByText("recipe menu open")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", {name: "Filter recipes"}));

        expect(screen.getByText("recipe menu open")).toBeInTheDocument();
    });
});
