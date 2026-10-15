import React from "react";
import {fireEvent, screen, within} from "@testing-library/react";
import {useData} from "../../fetch";
import RecipeMenu from "../RecipeMenu";
import {renderPage} from "../../testUtils";

jest.mock("../../fetch", () => ({useData: jest.fn()}));

const menu = {categories: ["Maso", "Polievky"], ingredients: ["Batatas", "Soľ & korenie", "Cesnak"]};

function setup(at = "/recipe/1") {
    const onClose = jest.fn();
    renderPage(<RecipeMenu open onClose={onClose}/>, {path: "*", at});
    return {onClose};
}

const chips = () => within(screen.getByRole("list", {name: "Ingredients"})).getAllByRole("listitem").map((item) => item.textContent);

describe("RecipeMenu", () => {
    beforeEach(() => useData.mockReturnValue({data: menu, loaded: true, error: null}));

    test("reads the user's menu while the drawer is open", () => {
        setup();
        expect(useData).toHaveBeenCalledWith("/user/Stanley/menu", true);
    });

    test("shows the loader until the menu arrives", () => {
        useData.mockReturnValue({data: null, loaded: false, error: null});
        setup();
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("opens on the ingredients", () => {
        setup();

        expect(screen.getByRole("tab", {name: "Ingredients"})).toHaveAttribute("aria-selected", "true");
        expect(chips()).toEqual(["Batatas", "Soľ & korenie", "Cesnak"]);
        expect(screen.queryByRole("list", {name: "Categories"})).not.toBeInTheDocument();
    });

    test("narrows the ingredients to the search, whatever the case", () => {
        setup();

        fireEvent.change(screen.getByRole("textbox", {name: "Search ingredients"}), {target: {value: "SOĽ"}});
        expect(chips()).toEqual(["Soľ & korenie"]);

        fireEvent.change(screen.getByRole("textbox", {name: "Search ingredients"}), {target: {value: "xyz"}});
        expect(screen.getByText("No ingredient matches.")).toBeInTheDocument();
    });

    test("filters by the picked ingredient, encoded, and closes", () => {
        const {onClose} = setup();

        fireEvent.click(screen.getByRole("button", {name: "Soľ & korenie"}));

        expect(onClose).toHaveBeenCalled();
        expect(screen.getByTestId("location")).toHaveTextContent("/?ingredient=So%C4%BE+%26+korenie");
    });

    test("filters by the category picked on its tab", () => {
        setup();

        fireEvent.click(screen.getByRole("tab", {name: "Categories"}));
        fireEvent.click(within(screen.getByRole("list", {name: "Categories"})).getByRole("button", {name: /Polievky/}));

        expect(screen.getByTestId("location")).toHaveTextContent("/?category=Polievky");
    });

    test("shows the filter in use, on its own tab, and clears it", () => {
        const {onClose} = setup("/?category=Maso");

        expect(screen.getByRole("tab", {name: "Categories"})).toHaveAttribute("aria-selected", "true");
        expect(screen.getByText("Category")).toBeInTheDocument();
        expect(within(screen.getByRole("list", {name: "Categories"})).getByRole("button", {name: /Maso/})).toHaveClass("Mui-selected");

        fireEvent.click(screen.getByRole("button", {name: "Clear"}));

        expect(onClose).toHaveBeenCalled();
        expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    });

    test("closes from its header", () => {
        const {onClose} = setup();

        fireEvent.click(screen.getByRole("button", {name: "Close"}));

        expect(onClose).toHaveBeenCalled();
    });
});
