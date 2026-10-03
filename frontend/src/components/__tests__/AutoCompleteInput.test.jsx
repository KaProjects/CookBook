import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import AutoCompleteInput from "../AutoCompleteInput";

function setup(props = {}) {
    const onChange = jest.fn();
    render(<AutoCompleteInput value="" onChange={onChange} options={["Maso", "Polievky"]} label="Category" {...props}/>);
    return {onChange, input: screen.getByRole("combobox", {name: "Category"})};
}

describe("AutoCompleteInput", () => {
    test("picks one of the values in use", () => {
        const {onChange, input} = setup();

        fireEvent.change(input, {target: {value: "Pol"}});
        fireEvent.click(screen.getByRole("option", {name: "Polievky"}));

        expect(onChange).toHaveBeenCalledWith("Polievky");
    });

    test("offers to add a new value", () => {
        const {onChange, input} = setup();

        fireEvent.change(input, {target: {value: "Dezerty"}});
        fireEvent.click(screen.getByRole("option", {name: 'Add "Dezerty"'}));

        expect(onChange).toHaveBeenCalledWith("Dezerty");
    });

    test("does not offer to add a value already in use", () => {
        const {input} = setup();

        fireEvent.change(input, {target: {value: "Maso"}});

        expect(screen.queryByRole("option", {name: 'Add "Maso"'})).not.toBeInTheDocument();
    });

    test("takes free text on Enter", () => {
        const {onChange, input} = setup();

        fireEvent.change(input, {target: {value: "Ryby"}});
        fireEvent.keyDown(input, {key: "Enter"});

        expect(onChange).toHaveBeenCalledWith("Ryby");
    });

    test("is marked invalid while empty, and limits the length", () => {
        const {input} = setup({maxLength: 5});
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveAttribute("maxlength", "5");
    });
});
