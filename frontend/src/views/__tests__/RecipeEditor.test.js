import React from "react";
import {fireEvent, render, screen, waitFor, within} from "@testing-library/react";
import {MemoryRouter, Route, Routes, useLocation} from "react-router-dom";
import axios from "axios";
import RecipeEditor from "../RecipeEditor";

jest.mock("axios");

const menu = {categories: ["Maso", "Polievky"], ingredients: ["Batatas", "Pomodoro"]};

const existingRecipe = () => ({
    id: "2",
    name: "Tomato soup",
    category: "Polievky",
    image: "data:image/jpeg;base64,AA==",
    ingredients: [{name: "Pomodoro", quantity: "4ks", optional: false}],
    steps: [
        {number: 3, text: "Serve", optional: false},
        {number: 1, text: "Chop", optional: false},
        {number: 2, text: "Boil", optional: true},
    ],
});

function LocationDisplay() {
    return <div data-testid="location">{useLocation().pathname}</div>;
}

function mockBackend(recipe = existingRecipe()) {
    axios.get.mockImplementation(url => {
        if (url === "/api/list/Stanley/menu") return Promise.resolve({data: menu});
        if (url === "/api/recipe/2") return Promise.resolve({data: recipe});
        return Promise.reject(new Error("unexpected " + url));
    });
}

function setupEditor(selectedRecipeId = null) {
    const props = {user: "Stanley", selectedRecipeId, setSelectedRecipe: jest.fn()};
    render(
        <MemoryRouter initialEntries={[selectedRecipeId ? "/edit" : "/create"]}>
            <RecipeEditor {...props}/>
            <Routes><Route path="*" element={<LocationDisplay/>}/></Routes>
        </MemoryRouter>
    );
    return props;
}

const nameField = () => screen.getByRole("textbox", {name: "Name"});
const categoryField = () => screen.getByRole("combobox", {name: "Category"});
const iconButtons = (icon) => screen.getAllByRole("button").filter(button => within(button).queryByTestId(icon));
// Step fields are the only unlabelled text boxes.
const stepFields = () => screen.getAllByRole("textbox", {name: ""});

function typeCategory(value) {
    fireEvent.change(categoryField(), {target: {value}});
    fireEvent.keyDown(categoryField(), {key: "Enter"});
}

describe("RecipeEditor", () => {
    beforeEach(() => {
        axios.get.mockReset();
        axios.post.mockReset();
        axios.put.mockReset();
        jest.spyOn(console, "error").mockImplementation(() => {});
        jest.spyOn(window, "alert").mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
        window.alert.mockRestore();
    });

    describe("creating", () => {
        test("starts empty and only loads the autocomplete options", async () => {
            mockBackend();
            setupEditor();

            expect(await screen.findByRole("button", {name: "Create Recipe"})).toBeDisabled();
            expect(nameField()).toHaveValue("");
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith("/api/list/Stanley/menu");
        });

        test("requires a name and a category", async () => {
            mockBackend();
            setupEditor();
            await screen.findByRole("button", {name: "Create Recipe"});

            fireEvent.change(nameField(), {target: {value: "Guláš"}});
            expect(screen.getByRole("button", {name: "Create Recipe"})).toBeDisabled();

            typeCategory("Maso");
            expect(screen.getByRole("button", {name: "Create Recipe"})).toBeEnabled();

            fireEvent.change(nameField(), {target: {value: ""}});
            expect(screen.getByRole("button", {name: "Create Recipe"})).toBeDisabled();
        });

        test("posts the recipe for the current cook and opens it", async () => {
            mockBackend();
            axios.post.mockResolvedValue({data: "new-id"});
            const props = setupEditor();
            await screen.findByRole("button", {name: "Create Recipe"});

            fireEvent.change(nameField(), {target: {value: "Guláš"}});
            typeCategory("Maso");
            fireEvent.click(screen.getByRole("button", {name: "Create Recipe"}));

            await waitFor(() => expect(props.setSelectedRecipe).toHaveBeenCalledWith("new-id"));
            expect(axios.post).toHaveBeenCalledWith("/api/recipe", expect.objectContaining({
                cook: "Stanley",
                name: "Guláš",
                category: "Maso",
                image: null,
                ingredients: [],
                steps: [],
            }));
            expect(screen.getByTestId("location")).toHaveTextContent("/recipe");
        });

        test("an added ingredient must have a name before saving", async () => {
            mockBackend();
            setupEditor();
            await screen.findByRole("button", {name: "Create Recipe"});
            fireEvent.change(nameField(), {target: {value: "Guláš"}});
            typeCategory("Maso");

            // With no ingredients and no steps there are two add buttons: ingredients, then steps.
            fireEvent.click(iconButtons("AddCircleIcon")[0]);

            expect(screen.getByRole("textbox", {name: "Quantity"})).toBeInTheDocument();
            expect(screen.getByRole("button", {name: "Create Recipe"})).toBeDisabled();

            const ingredientName = screen.getByRole("combobox", {name: "Name"});
            fireEvent.change(ingredientName, {target: {value: "Batatas"}});
            fireEvent.keyDown(ingredientName, {key: "Enter"});

            expect(screen.getByRole("button", {name: "Create Recipe"})).toBeEnabled();
        });

        test("an added step must have text before saving", async () => {
            mockBackend();
            axios.post.mockResolvedValue({data: "new-id"});
            setupEditor();
            await screen.findByRole("button", {name: "Create Recipe"});
            fireEvent.change(nameField(), {target: {value: "Guláš"}});
            typeCategory("Maso");

            fireEvent.click(iconButtons("AddCircleIcon")[1]);
            expect(screen.getByRole("button", {name: "Create Recipe"})).toBeDisabled();

            fireEvent.change(stepFields()[0], {target: {value: "Cook it"}});
            fireEvent.click(screen.getByRole("button", {name: "Create Recipe"}));

            await waitFor(() => expect(axios.post).toHaveBeenCalled());
            expect(axios.post.mock.calls[0][1].steps).toEqual([{number: 1, text: "Cook it", optional: false}]);
        });

        test("attaches a selected image", async () => {
            mockBackend();
            axios.post.mockResolvedValue({data: "new-id"});
            const {container} = render(
                <MemoryRouter><RecipeEditor user="Stanley" selectedRecipeId={null} setSelectedRecipe={jest.fn()}/></MemoryRouter>
            );
            await screen.findByRole("button", {name: "Create Recipe"});

            const file = new File(["img"], "soup.png", {type: "image/png"});
            // A file input has no role or label to query by.
            // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
            fireEvent.change(container.querySelector("input[type='file']"), {target: {files: [file]}});

            const image = await screen.findByRole("img", {name: "recipe"});
            expect(image.getAttribute("src")).toMatch(/^data:image\/png;base64,/);
        });

        test("keeps the form and alerts when saving fails", async () => {
            mockBackend();
            axios.post.mockRejectedValue(new Error("Request failed with status code 400"));
            const props = setupEditor();
            await screen.findByRole("button", {name: "Create Recipe"});
            fireEvent.change(nameField(), {target: {value: "Guláš"}});
            typeCategory("Maso");

            fireEvent.click(screen.getByRole("button", {name: "Create Recipe"}));

            await waitFor(() => expect(window.alert).toHaveBeenCalled());
            expect(await screen.findByRole("button", {name: "Create Recipe"})).toBeEnabled();
            expect(nameField()).toHaveValue("Guláš");
            expect(props.setSelectedRecipe).not.toHaveBeenCalled();
        });

        test("shows the error when the autocomplete options fail to load", async () => {
            axios.get.mockRejectedValue(new Error("Network Error"));
            setupEditor();

            // The empty form still renders; the error is only logged.
            expect(await screen.findByRole("button", {name: "Create Recipe"})).toBeInTheDocument();
            await waitFor(() => expect(console.error).toHaveBeenCalled());
        });
    });

    describe("editing", () => {
        test("loads the recipe with steps in order", async () => {
            mockBackend();
            setupEditor("2");

            expect(await screen.findByRole("button", {name: "Save Recipe"})).toBeEnabled();
            expect(nameField()).toHaveValue("Tomato soup");
            await waitFor(() => expect(categoryField()).toHaveValue("Polievky"));
            expect(screen.getByRole("textbox", {name: "Quantity"})).toHaveValue("4ks");
            expect(stepFields().map(field => field.value)).toEqual(["Chop", "Boil", "Serve"]);
            expect(screen.getByRole("img", {name: "recipe"})).toHaveAttribute("src", "data:image/jpeg;base64,AA==");
        });

        test("puts the changes and reopens the recipe", async () => {
            mockBackend();
            axios.put.mockResolvedValue({});
            const props = setupEditor("2");
            await screen.findByRole("button", {name: "Save Recipe"});

            fireEvent.change(nameField(), {target: {value: "Better soup"}});
            fireEvent.click(screen.getByRole("button", {name: "Save Recipe"}));

            await waitFor(() => expect(props.setSelectedRecipe).toHaveBeenCalledWith("2"));
            expect(axios.put).toHaveBeenCalledWith("/api/recipe", expect.objectContaining({id: "2", name: "Better soup"}));
            expect(screen.getByTestId("location")).toHaveTextContent("/recipe");
        });

        test("renumbers steps after deleting one", async () => {
            mockBackend();
            axios.put.mockResolvedValue({});
            setupEditor("2");
            await screen.findByRole("button", {name: "Save Recipe"});

            // Delete buttons: one per ingredient, one per step, then the image one.
            const deleteButtons = iconButtons("DeleteIcon");
            fireEvent.click(deleteButtons[1]);
            fireEvent.click(screen.getByRole("button", {name: "Save Recipe"}));

            await waitFor(() => expect(axios.put).toHaveBeenCalled());
            expect(axios.put.mock.calls[0][1].steps).toEqual([
                {number: 1, text: "Boil", optional: true},
                {number: 2, text: "Serve", optional: false},
            ]);
        });

        test("inserts a step below and renumbers", async () => {
            mockBackend();
            setupEditor("2");
            await screen.findByRole("button", {name: "Save Recipe"});

            // Add buttons: one per ingredient, then one per step.
            fireEvent.click(iconButtons("AddCircleIcon")[1]);

            expect(stepFields().map(field => field.value)).toEqual(["Chop", "", "Boil", "Serve"]);
            expect(screen.getByRole("button", {name: "Save Recipe"})).toBeDisabled();
        });

        test("toggles a step between mandatory and optional", async () => {
            mockBackend();
            axios.put.mockResolvedValue({});
            setupEditor("2");
            await screen.findByRole("button", {name: "Save Recipe"});

            // Checked boxes are mandatory: ingredient Pomodoro, then steps Chop and Serve.
            fireEvent.click(iconButtons("CheckBoxOutlinedIcon")[1]);
            fireEvent.click(screen.getByRole("button", {name: "Save Recipe"}));

            await waitFor(() => expect(axios.put).toHaveBeenCalled());
            expect(axios.put.mock.calls[0][1].steps[0]).toEqual({number: 1, text: "Chop", optional: true});
        });

        test("removes ingredients and the image", async () => {
            mockBackend();
            axios.put.mockResolvedValue({});
            setupEditor("2");
            await screen.findByRole("button", {name: "Save Recipe"});

            const deleteButtons = iconButtons("DeleteIcon");
            fireEvent.click(deleteButtons[deleteButtons.length - 1]);
            fireEvent.click(iconButtons("DeleteIcon")[0]);
            fireEvent.click(screen.getByRole("button", {name: "Save Recipe"}));

            await waitFor(() => expect(axios.put).toHaveBeenCalled());
            expect(axios.put.mock.calls[0][1].image).toBeNull();
            expect(axios.put.mock.calls[0][1].ingredients).toEqual([]);
        });

        test("shows the error when the recipe cannot be loaded", async () => {
            axios.get.mockImplementation(url => url.endsWith("/menu")
                ? Promise.resolve({data: menu})
                : Promise.reject(new Error("Request failed with status code 404")));
            setupEditor("2");

            expect(await screen.findByRole("alert")).toHaveTextContent("Request failed with status code 404");
        });
    });
});
