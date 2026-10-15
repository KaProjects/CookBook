import React from "react";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import axios from "axios";
import DeleteRecipeDialog from "../DeleteRecipeDialog";
import {renderPage} from "../../testUtils";

jest.mock("axios");

function setup(props = {}) {
    const onClose = jest.fn();
    renderPage(<DeleteRecipeDialog open recipeId="7" recipeName="Tomato soup" onClose={onClose} {...props}/>,
        {path: "/recipe/:id", at: "/recipe/7"});
    return onClose;
}

describe("DeleteRecipeDialog", () => {
    beforeEach(() => axios.delete.mockReset());

    test("names the recipe and says it cannot be undone", () => {
        setup();

        expect(screen.getByRole("dialog", {name: "Delete recipe?"})).toHaveTextContent(
            "Tomato soup will be deleted with its ingredients, steps and picture. This cannot be undone.");
    });

    test("still asks when the name is not known yet", () => {
        setup({recipeName: undefined});

        expect(screen.getByRole("dialog")).toHaveTextContent("The recipe will be deleted");
    });

    test("deletes the recipe and shows the list", async () => {
        axios.delete.mockResolvedValue({status: 204});
        const onClose = setup();

        fireEvent.click(screen.getByRole("button", {name: "Delete"}));

        await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/));
        expect(axios.delete).toHaveBeenCalledWith("/api/recipe/7");
        expect(onClose).toHaveBeenCalled();
    });

    test("deletes nothing when cancelled", () => {
        const onClose = setup();

        fireEvent.click(screen.getByRole("button", {name: "Cancel"}));

        expect(onClose).toHaveBeenCalled();
        expect(axios.delete).not.toHaveBeenCalled();
        expect(screen.getByTestId("location")).toHaveTextContent("/recipe/7");
    });

    test("shows why the recipe could not be deleted and stays", async () => {
        axios.delete.mockRejectedValue({response: {status: 404, statusText: "Not Found", data: {detail: "Recipe '7' does not exist."}}});
        const onClose = setup();

        fireEvent.click(screen.getByRole("button", {name: "Delete"}));

        expect(await screen.findByRole("alert")).toHaveTextContent("404 Not Found: Recipe '7' does not exist.");
        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByRole("button", {name: "Delete"})).toBeEnabled();
        expect(screen.getByTestId("location")).toHaveTextContent("/recipe/7");
    });
});
