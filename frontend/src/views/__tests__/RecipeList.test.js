import React from "react";
import {fireEvent, render, screen, within} from "@testing-library/react";
import {MemoryRouter, Route, Routes, useLocation} from "react-router-dom";
import {useData} from "../../fetch";
import RecipeList from "../RecipeList";

jest.mock("../../fetch", () => ({useData: jest.fn()}));

const data = {
    categories: [
        {name: "Maso", recipes: [{id: "3", name: "Steak", hasImage: true, hasSteps: true}]},
        {name: "Polievky", recipes: [
            {id: "1", name: "Tomato soup", hasImage: false, hasSteps: true},
            {id: "2", name: "Onion soup", hasImage: true, hasSteps: false},
        ]},
    ],
};

function LocationDisplay() {
    return <div data-testid="location">{useLocation().pathname}</div>;
}

function setupList(overrides = {}) {
    const props = {
        user: "Stanley",
        categoryFilter: null,
        ingredientFilter: null,
        setSelectedRecipe: jest.fn(),
        ...overrides,
    };
    render(
        <MemoryRouter>
            <RecipeList {...props}/>
            <Routes><Route path="*" element={<LocationDisplay/>}/></Routes>
        </MemoryRouter>
    );
    return props;
}

describe("RecipeList", () => {
    beforeEach(() => {
        useData.mockReset();
        useData.mockReturnValue({data, loaded: true, error: null});
    });

    test("requests the user's recipes", () => {
        setupList();
        expect(useData).toHaveBeenCalledWith("/list/Stanley/category/recipe");
    });

    test("filters by category", () => {
        setupList({categoryFilter: "Polievky"});
        expect(useData).toHaveBeenCalledWith("/list/Stanley/category/recipe?category=Polievky");
    });

    test("filters by ingredient", () => {
        setupList({ingredientFilter: "Batatas"});
        expect(useData).toHaveBeenCalledWith("/list/Stanley/category/recipe?ingredient=Batatas");
    });

    test("shows the loader until the list arrives", () => {
        useData.mockReturnValue({data: null, loaded: false, error: null});
        setupList();
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("groups recipes under their categories", () => {
        setupList();

        expect(screen.getByText("Maso")).toBeInTheDocument();
        expect(screen.getByText("Polievky")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: /Steak/})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: /Tomato soup/})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: /Onion soup/})).toBeInTheDocument();
    });

    test("flags recipes without image or steps", () => {
        setupList();

        const steak = screen.getByRole("button", {name: /Steak/});
        const tomato = screen.getByRole("button", {name: /Tomato soup/});
        const onion = screen.getByRole("button", {name: /Onion soup/});
        expect(within(steak).queryByTestId("NoPhotographyIcon")).not.toBeInTheDocument();
        expect(within(steak).queryByTestId("ContentPasteOffIcon")).not.toBeInTheDocument();
        expect(within(tomato).getByTestId("NoPhotographyIcon")).toBeInTheDocument();
        expect(within(tomato).queryByTestId("ContentPasteOffIcon")).not.toBeInTheDocument();
        expect(within(onion).getByTestId("ContentPasteOffIcon")).toBeInTheDocument();
        expect(within(onion).queryByTestId("NoPhotographyIcon")).not.toBeInTheDocument();
    });

    test("opens the clicked recipe", () => {
        const props = setupList();

        fireEvent.click(screen.getByRole("button", {name: /Onion soup/}));

        expect(props.setSelectedRecipe).toHaveBeenCalledWith("2");
        expect(screen.getByTestId("location")).toHaveTextContent("/recipe");
    });
});
