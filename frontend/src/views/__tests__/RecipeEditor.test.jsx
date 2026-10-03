import React from "react";
import {fireEvent, screen, waitFor, within} from "@testing-library/react";
import axios from "axios";
import RecipeEditor from "../RecipeEditor";
import {renderPage} from "../../testUtils";

jest.mock("axios");

const menu = {categories: ["Maso", "Polievky"], ingredients: ["Batatas", "Pomodoro"]};

const stored = {
    id: "2",
    cook: "Stanley",
    name: "Tomato soup",
    category: "Polievky",
    image: "data:image/jpeg;base64,AA==",
    ingredients: [{name: "Pomodoro", quantity: "4 pcs", optional: false}],
    steps: [{number: 1, text: "Chop", optional: false}, {number: 2, text: "Boil", optional: true}],
};

function backend(recipe = stored) {
    axios.get.mockImplementation((url) => {
        if (url === "/api/user/Stanley/menu") return Promise.resolve({data: menu});
        if (url === "/api/recipe/2") return Promise.resolve({data: recipe});
        return Promise.reject(new Error("unexpected " + url));
    });
}

const create = () => renderPage(<RecipeEditor/>, {path: "/create", at: "/create"});
const edit = () => renderPage(<RecipeEditor/>, {path: "/recipe/:id/edit", at: "/recipe/2/edit"});

const nameField = () => screen.getByRole("textbox", {name: "Name"});
const categoryField = () => screen.getByRole("combobox", {name: "Category"});
const saveButton = (label) => screen.getByRole("button", {name: label});

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
    });

    afterEach(() => console.error.mockRestore());

    describe("a new recipe", () => {
        test("starts empty, and needs a name and a category", async () => {
            backend();
            create();

            expect(screen.getByRole("heading", {name: "New recipe"})).toBeInTheDocument();
            expect(nameField()).toHaveValue("");
            expect(saveButton("Create Recipe")).toBeDisabled();

            fireEvent.change(nameField(), {target: {value: "Guláš"}});
            expect(saveButton("Create Recipe")).toBeDisabled();
            typeCategory("Maso");
            expect(saveButton("Create Recipe")).toBeEnabled();
            await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/api/user/Stanley/menu"));
        });

        test("is created for the user and then opened", async () => {
            backend();
            axios.post.mockResolvedValue({data: {...stored, id: "new id"}});
            create();

            fireEvent.change(nameField(), {target: {value: "  Guláš "}});
            typeCategory("Maso");
            fireEvent.click(screen.getByRole("button", {name: "Add step"}));
            fireEvent.change(screen.getByRole("textbox", {name: "Step 1"}), {target: {value: "Cook it"}});
            fireEvent.click(saveButton("Create Recipe"));

            await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/recipe/new%20id"));
            expect(axios.post).toHaveBeenCalledWith("/api/recipe", {
                cook: "Stanley",
                name: "Guláš",
                category: "Maso",
                image: null,
                ingredients: [],
                steps: [{number: 1, text: "Cook it", optional: false}],
            });
        });

        test("cannot be saved with an unnamed ingredient or an empty step", () => {
            backend();
            create();
            fireEvent.change(nameField(), {target: {value: "Guláš"}});
            typeCategory("Maso");

            fireEvent.click(screen.getByRole("button", {name: "Add ingredient"}));
            expect(saveButton("Create Recipe")).toBeDisabled();
            const ingredient = screen.getByRole("combobox", {name: "Ingredient 1"});
            fireEvent.change(ingredient, {target: {value: "Batatas"}});
            fireEvent.keyDown(ingredient, {key: "Enter"});
            expect(saveButton("Create Recipe")).toBeEnabled();

            fireEvent.click(screen.getByRole("button", {name: "Add step"}));
            expect(saveButton("Create Recipe")).toBeDisabled();
        });

        test("shows why saving failed and keeps what was typed", async () => {
            backend();
            axios.post.mockRejectedValue({response: {status: 400, statusText: "Bad Request", data: {
                detail: "The request is not valid.", violations: [{field: "name", message: "must not be blank"}]}}});
            create();
            fireEvent.change(nameField(), {target: {value: "Guláš"}});
            typeCategory("Maso");

            fireEvent.click(saveButton("Create Recipe"));

            expect(await screen.findByRole("alert")).toHaveTextContent("400 Bad Request: name must not be blank");
            expect(nameField()).toHaveValue("Guláš");
            expect(saveButton("Create Recipe")).toBeEnabled();
            expect(screen.getByTestId("location")).toHaveTextContent("/create");
        });

        test("still works when the suggestions cannot be read", async () => {
            axios.get.mockRejectedValue(new Error("down"));
            create();

            expect(nameField()).toBeInTheDocument();
            await waitFor(() => expect(console.error).toHaveBeenCalled());
        });
    });

    describe("an existing recipe", () => {
        test("is loaded into the form", async () => {
            backend();
            edit();

            expect(await screen.findByRole("heading", {name: "Edit recipe"})).toBeInTheDocument();
            expect(nameField()).toHaveValue("Tomato soup");
            await waitFor(() => expect(categoryField()).toHaveValue("Polievky"));
            expect(screen.getByRole("combobox", {name: "Ingredient 1"})).toHaveValue("Pomodoro");
            expect(screen.getByRole("textbox", {name: "Step 2"})).toHaveValue("Boil");
            expect(screen.getByRole("img", {name: "Recipe"})).toBeInTheDocument();
            expect(saveButton("Save Recipe")).toBeEnabled();
        });

        test("is saved in place and then opened", async () => {
            backend();
            axios.put.mockResolvedValue({data: stored});
            edit();
            await screen.findByRole("heading", {name: "Edit recipe"});

            fireEvent.change(nameField(), {target: {value: "Better soup"}});
            fireEvent.click(screen.getByRole("button", {name: "Delete step 1"}));
            fireEvent.click(screen.getByRole("button", {name: "Remove picture"}));
            fireEvent.click(saveButton("Save Recipe"));

            await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/recipe/2"));
            expect(axios.put).toHaveBeenCalledWith("/api/recipe/2", {
                name: "Better soup",
                category: "Polievky",
                image: null,
                ingredients: [{name: "Pomodoro", quantity: "4 pcs", optional: false}],
                steps: [{number: 1, text: "Boil", optional: true}],
            });
        });

        test("keeps each step's own text when one above it is deleted", async () => {
            backend();
            edit();
            await screen.findByRole("heading", {name: "Edit recipe"});

            fireEvent.click(screen.getByRole("button", {name: "Delete step 1"}));

            const steps = screen.getByRole("list", {name: "Steps"});
            expect(within(steps).getAllByRole("textbox").map((field) => field.value)).toEqual(["Boil"]);
        });

        test("explains why it could not be loaded", async () => {
            axios.get.mockImplementation((url) => url.endsWith("/menu")
                ? Promise.resolve({data: menu})
                : Promise.reject({response: {status: 404, statusText: "Not Found", data: {detail: "Recipe '2' does not exist."}}}));
            edit();

            expect(await screen.findByRole("alert")).toHaveTextContent("404 Not Found: Recipe '2' does not exist.");
        });
    });
});
