import React from "react";
import {fireEvent, render, screen, within} from "@testing-library/react";
import {MemoryRouter, Route, Routes, useLocation} from "react-router-dom";
import generatePDF from "react-to-pdf";
import MainBar from "../MainBar";

jest.mock("react-to-pdf", () => jest.fn());

jest.mock("../../views/RecipeMenu", () => (props) =>
    <div>recipe menu open:{String(props.flag)}</div>
);

function LocationDisplay() {
    return <div data-testid="location">{useLocation().pathname}</div>;
}

function setupBar(overrides = {}) {
    const props = {
        user: "Stanley",
        categoryFilter: null,
        ingredientFilter: null,
        selectedRecipeId: null,
        userConfig: {menuAnchor: "right"},
        pdfProps: {ref: {current: null}, name: "Soup"},
        setSelectedRecipe: jest.fn(),
        showAllRecipes: jest.fn(),
        ...overrides,
    };
    render(
        <MemoryRouter initialEntries={["/recipe"]}>
            <MainBar {...props}/>
            <Routes>
                <Route path="*" element={<LocationDisplay/>}/>
            </Routes>
        </MemoryRouter>
    );
    return props;
}

const buttonWithIcon = (icon) => screen.getAllByRole("button").find(button => within(button).queryByTestId(icon));

describe("MainBar", () => {
    beforeEach(() => generatePDF.mockReset());

    test("shows the user's title", () => {
        setupBar();
        expect(screen.getByText("Stanley's CookBook")).toBeInTheDocument();
    });

    test("appends the active category filter", () => {
        setupBar({categoryFilter: "Polievky"});
        expect(screen.getByText(/Stanley's CookBook\s*- Polievky/)).toBeInTheDocument();
    });

    test("appends the active ingredient filter", () => {
        setupBar({ingredientFilter: "Batatas"});
        expect(screen.getByText(/Stanley's CookBook\s*- Batatas/)).toBeInTheDocument();
    });

    test("hides recipe actions when no recipe is selected", () => {
        setupBar();
        expect(screen.queryByTestId("EditIcon")).not.toBeInTheDocument();
        expect(screen.queryByTestId("DownloadIcon")).not.toBeInTheDocument();
    });

    test("create clears the selection and opens the editor", () => {
        const props = setupBar({selectedRecipeId: "1"});

        fireEvent.click(buttonWithIcon("AddIcon"));

        expect(props.setSelectedRecipe).toHaveBeenCalledWith(null);
        expect(screen.getByTestId("location")).toHaveTextContent("/create");
    });

    test("edit opens the editor for the selected recipe", () => {
        setupBar({selectedRecipeId: "1"});

        fireEvent.click(buttonWithIcon("EditIcon"));

        expect(screen.getByTestId("location")).toHaveTextContent("/edit");
    });

    test("download exports the recipe as a PDF named after it", () => {
        const props = setupBar({selectedRecipeId: "1"});

        fireEvent.click(buttonWithIcon("DownloadIcon"));

        expect(generatePDF).toHaveBeenCalledWith(props.pdfProps.ref, {filename: "Soup.pdf"});
    });

    test("menu button resets filters and goes home", () => {
        const props = setupBar();

        fireEvent.click(buttonWithIcon("MenuIcon"));

        expect(props.showAllRecipes).toHaveBeenCalled();
        expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    });

    test("filter button opens the recipe menu drawer", () => {
        setupBar();

        fireEvent.click(buttonWithIcon("FilterListIcon"));

        expect(screen.getByText("recipe menu open:true")).toBeInTheDocument();
    });
});
