import React from "react";
import {fireEvent, screen} from "@testing-library/react";
import PageNotFound from "../PageNotFound";
import {renderPage} from "../../testUtils";

describe("PageNotFound", () => {
    test("says so and leads back to the recipes", () => {
        renderPage(<PageNotFound/>, {path: "*", at: "/nothing"});

        expect(screen.getByRole("heading", {name: "404 Page not found"})).toBeInTheDocument();
        fireEvent.click(screen.getByRole("link", {name: "Back to the recipes"}));
        expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    });
});
