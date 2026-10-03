import React from "react";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import ImageField, {MAX_IMAGE_BYTES} from "../ImageField";

const pick = (file) => fireEvent.change(screen.getByLabelText("Recipe picture"), {target: {files: [file]}});

describe("ImageField", () => {
    test("reads a chosen picture as a data URL", async () => {
        const onChange = jest.fn();
        render(<ImageField image={null} onChange={onChange}/>);

        pick(new File(["png bytes"], "soup.png", {type: "image/png"}));

        await waitFor(() => expect(onChange).toHaveBeenCalled());
        expect(onChange.mock.calls[0][0]).toMatch(/^data:image\/png;base64,/);
    });

    test("refuses a file that is not a picture", () => {
        const onChange = jest.fn();
        render(<ImageField image={null} onChange={onChange}/>);

        pick(new File(["text"], "notes.txt", {type: "text/plain"}));

        expect(screen.getByRole("alert")).toHaveTextContent("notes.txt is not a picture.");
        expect(onChange).not.toHaveBeenCalled();
    });

    test("refuses a picture too large to upload", () => {
        const onChange = jest.fn();
        render(<ImageField image={null} onChange={onChange}/>);
        const large = new File(["x"], "huge.jpg", {type: "image/jpeg"});
        Object.defineProperty(large, "size", {value: MAX_IMAGE_BYTES + 1});

        pick(large);

        expect(screen.getByRole("alert")).toHaveTextContent("huge.jpg is too large - the limit is 7 MB.");
        expect(onChange).not.toHaveBeenCalled();
    });

    test("ignores a cancelled choice", () => {
        const onChange = jest.fn();
        render(<ImageField image={null} onChange={onChange}/>);

        fireEvent.change(screen.getByLabelText("Recipe picture"), {target: {files: []}});

        expect(onChange).not.toHaveBeenCalled();
    });

    test("shows the picture and removes it", () => {
        const onChange = jest.fn();
        render(<ImageField image="data:image/jpeg;base64,AA==" onChange={onChange}/>);

        expect(screen.getByRole("img", {name: "Recipe"})).toHaveAttribute("src", "data:image/jpeg;base64,AA==");
        fireEvent.click(screen.getByRole("button", {name: "Remove picture"}));

        expect(onChange).toHaveBeenCalledWith(null);
    });
});
