import React from "react";
import {fireEvent, render, screen, within} from "@testing-library/react";
import {useData} from "../../fetch";
import Login from "../Login";

jest.mock("../../fetch", () => ({useData: jest.fn()}));

// Every user button is labelled "add" (aria-label), so find them by their text.
const userButton = (name) => screen.getAllByRole("button").find(button => within(button).queryByText(name));

describe("Login", () => {
    beforeEach(() => useData.mockReset());

    test("requests the user list", () => {
        useData.mockReturnValue({data: null, loaded: false, error: null});

        render(<Login setUser={jest.fn()}/>);

        expect(useData).toHaveBeenCalledWith("/user");
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("shows the loading error", () => {
        useData.mockReturnValue({data: null, loaded: false, error: new Error("Network Error")});

        render(<Login setUser={jest.fn()}/>);

        expect(screen.getByRole("alert")).toHaveTextContent("Network Error");
    });

    test("offers every user and logs in the clicked one", () => {
        useData.mockReturnValue({data: ["Stanley", "Anna"], loaded: true, error: null});
        const setUser = jest.fn();

        render(<Login setUser={setUser}/>);
        fireEvent.click(userButton("Anna"));

        expect(userButton("Stanley")).toBeInTheDocument();
        expect(setUser).toHaveBeenCalledTimes(1);
        expect(setUser).toHaveBeenCalledWith("Anna");
    });

    test("picks a face icon by the name ending", () => {
        useData.mockReturnValue({data: ["Stanley", "Anna"], loaded: true, error: null});

        render(<Login setUser={jest.fn()}/>);

        expect(within(userButton("Anna")).getByTestId("Face4Icon")).toBeInTheDocument();
        expect(within(userButton("Stanley")).getByTestId("FaceIcon")).toBeInTheDocument();
    });

    test("logs in automatically when there is only one user", () => {
        useData.mockReturnValue({data: ["Stanley"], loaded: true, error: null});
        const setUser = jest.fn();

        render(<Login setUser={setUser}/>);

        expect(setUser).toHaveBeenCalledWith("Stanley");
    });
});
