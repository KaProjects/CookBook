import React from "react";
import {render, screen} from "@testing-library/react";
import Loader from "../Loader";

describe("Loader", () => {
    test("shows a spinner while there is no error", () => {
        render(<Loader error={null}/>);

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    test("shows the error message instead of the spinner", () => {
        render(<Loader error={new Error("Request failed with status code 500")}/>);

        expect(screen.getByRole("alert")).toHaveTextContent("Request failed with status code 500");
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
});
