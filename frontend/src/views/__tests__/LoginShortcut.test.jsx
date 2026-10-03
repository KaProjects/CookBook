import React from "react";
import {screen} from "@testing-library/react";
import LoginShortcut from "../LoginShortcut";
import {renderPage} from "../../testUtils";

describe("LoginShortcut", () => {
    test("opens the cookbook of the user in the address, then the recipes", () => {
        const selectUser = jest.fn();

        renderPage(<LoginShortcut/>, {path: "/login/:user", at: "/login/Anna%20M", state: {selectUser}});

        expect(selectUser).toHaveBeenCalledWith("Anna M");
        expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    });
});
