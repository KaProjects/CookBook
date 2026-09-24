import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import AutoCompleteInput from "../AutoCompleteInput";

function setupInput(overrides = {}) {
    const props = {
        value: "",
        onInputChange: jest.fn(),
        options: ["Maso", "Polievky"],
        name: "Category",
        ...overrides,
    };
    render(<AutoCompleteInput {...props}/>);
    return props;
}

describe("AutoCompleteInput", () => {
    test("selects an existing option", () => {
        const props = setupInput();

        fireEvent.change(screen.getByRole("combobox", {name: "Category"}), {target: {value: "Pol"}});
        fireEvent.click(screen.getByRole("option", {name: "Polievky"}));

        expect(props.onInputChange).toHaveBeenCalledWith("Polievky");
    });

    test("offers to add a value that is not an option yet", () => {
        const props = setupInput();

        fireEvent.change(screen.getByRole("combobox", {name: "Category"}), {target: {value: "Dezerty"}});
        fireEvent.click(screen.getByRole("option", {name: 'Add "Dezerty"'}));

        expect(props.onInputChange).toHaveBeenCalledWith("Dezerty");
    });

    test("does not offer to add an exact existing option", () => {
        setupInput();

        fireEvent.change(screen.getByRole("combobox", {name: "Category"}), {target: {value: "Maso"}});

        expect(screen.queryByRole("option", {name: 'Add "Maso"'})).not.toBeInTheDocument();
        expect(screen.getByRole("option", {name: "Maso"})).toBeInTheDocument();
    });

    test("accepts free text on Enter", () => {
        const props = setupInput();
        const input = screen.getByRole("combobox", {name: "Category"});

        fireEvent.change(input, {target: {value: "Ryby"}});
        fireEvent.keyDown(input, {key: "Enter"});

        expect(props.onInputChange).toHaveBeenCalledWith("Ryby");
    });

    test("marks an empty value as invalid", () => {
        setupInput({value: ""});
        expect(screen.getByRole("combobox", {name: "Category"})).toHaveAttribute("aria-invalid", "true");
    });

    test("marks a filled value as valid", () => {
        setupInput({value: "Maso"});
        expect(screen.getByRole("combobox", {name: "Category"})).toHaveAttribute("aria-invalid", "false");
    });
});
