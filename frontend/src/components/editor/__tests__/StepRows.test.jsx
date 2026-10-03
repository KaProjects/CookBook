import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import StepRows from "../StepRows";

const steps = [
    {key: "a", text: "Chop", optional: false},
    {key: "b", text: "", optional: true},
];

function setup(rows = steps, errors = [false, true]) {
    const dispatch = jest.fn();
    render(<StepRows steps={rows} errors={errors} dispatch={dispatch}/>);
    return dispatch;
}

describe("StepRows", () => {
    test("offers to add the first step", () => {
        const dispatch = setup([], []);

        fireEvent.click(screen.getByRole("button", {name: "Add step"}));

        expect(dispatch).toHaveBeenCalledWith({type: "addStep", after: -1});
    });

    test("numbers the steps in their order and marks the empty one", () => {
        setup();

        expect(screen.getByRole("textbox", {name: "Step 1"})).toHaveValue("Chop");
        expect(screen.getByRole("textbox", {name: "Step 2"})).toHaveAttribute("aria-invalid", "true");
        expect(screen.getByRole("textbox", {name: "Step 1"})).toHaveAttribute("aria-invalid", "false");
    });

    test("changes, toggles, deletes and adds below a step", () => {
        const dispatch = setup();

        fireEvent.change(screen.getByRole("textbox", {name: "Step 2"}), {target: {value: "Boil"}});
        expect(dispatch).toHaveBeenCalledWith({type: "changeStep", index: 1, changes: {text: "Boil"}});

        fireEvent.click(screen.getByRole("button", {name: "step 1 is required"}));
        expect(dispatch).toHaveBeenCalledWith({type: "changeStep", index: 0, changes: {optional: true}});

        fireEvent.click(screen.getByRole("button", {name: "Delete step 2"}));
        expect(dispatch).toHaveBeenCalledWith({type: "removeStep", index: 1});

        fireEvent.click(screen.getByRole("button", {name: "Add below step 1"}));
        expect(dispatch).toHaveBeenCalledWith({type: "addStep", after: 0});
    });
});
