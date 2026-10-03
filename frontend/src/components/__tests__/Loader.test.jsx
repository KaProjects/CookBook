import React from "react";
import {render, screen} from "@testing-library/react";
import Loader from "../Loader";

describe("Loader", () => {
    test("spins while there is no error", () => {
        render(<Loader/>);

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    test("explains the failure instead", () => {
        render(<Loader error={{response: {status: 404, statusText: "Not Found", data: {detail: "Recipe 'x' does not exist."}}}}/>);

        expect(screen.getByRole("alert")).toHaveTextContent("404 Not Found: Recipe 'x' does not exist.");
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
});
