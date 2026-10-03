import React from "react";
import {fireEvent, screen, within} from "@testing-library/react";
import {useData} from "../../fetch";
import Login from "../Login";
import {renderPage} from "../../testUtils";

jest.mock("../../fetch", () => ({useData: jest.fn()}));

function setup() {
    const selectUser = jest.fn();
    renderPage(<Login/>, {state: {user: null, selectUser}});
    return selectUser;
}

describe("Login", () => {
    test("asks for the users, showing the loader meanwhile", () => {
        useData.mockReturnValue({data: null, loaded: false, error: null});
        setup();

        expect(useData).toHaveBeenCalledWith("/user");
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("explains why the users could not be read", () => {
        useData.mockReturnValue({data: null, loaded: false, error: {code: "ERR_NETWORK", message: "Network Error"}});
        setup();

        expect(screen.getByRole("alert")).toHaveTextContent("Network Error");
    });

    test("opens the cookbook of the user picked", () => {
        useData.mockReturnValue({data: ["Stanley", "Anna"], loaded: true, error: null});
        const selectUser = setup();

        fireEvent.click(screen.getByRole("button", {name: "Anna"}));

        expect(selectUser).toHaveBeenCalledTimes(1);
        expect(selectUser).toHaveBeenCalledWith("Anna");
    });

    test("gives each user a face", () => {
        useData.mockReturnValue({data: ["Stanley", "Anna"], loaded: true, error: null});
        setup();

        expect(within(screen.getByRole("button", {name: "Anna"})).getByTestId("Face4Icon")).toBeInTheDocument();
        expect(within(screen.getByRole("button", {name: "Stanley"})).getByTestId("FaceIcon")).toBeInTheDocument();
    });

    test("opens the only cookbook there is without asking", () => {
        useData.mockReturnValue({data: ["Stanley"], loaded: true, error: null});
        const selectUser = setup();

        expect(selectUser).toHaveBeenCalledWith("Stanley");
    });
});
