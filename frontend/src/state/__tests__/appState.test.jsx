import React from "react";
import {act, render, renderHook, screen, waitFor} from "@testing-library/react";
import axios from "axios";
import AppState, {useAppState} from "../appState";
import {DEFAULT_USER_CONFIG} from "../../theme/colors";

jest.mock("axios");

const wrapper = ({children}) => <AppState>{children}</AppState>;

describe("AppState", () => {
    beforeEach(() => {
        sessionStorage.clear();
        axios.get.mockReset();
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => console.error.mockRestore());

    test("starts without a user and asks for nothing", () => {
        const {result} = renderHook(useAppState, {wrapper});

        expect(result.current.user).toBeNull();
        expect(result.current.userConfig).toEqual(DEFAULT_USER_CONFIG);
        expect(axios.get).not.toHaveBeenCalled();
    });

    test("restores the user of the tab and loads their layout", async () => {
        sessionStorage.setItem("user", "Anna");
        axios.get.mockResolvedValue({data: {menuAnchor: "left", recipeItemColor: "red"}});

        const {result} = renderHook(useAppState, {wrapper});

        expect(result.current.user).toBe("Anna");
        await waitFor(() => expect(result.current.userConfig.menuAnchor).toBe("left"));
        expect(axios.get).toHaveBeenCalledWith("/api/user/Anna/config");
    });

    test("remembers a selected user for the tab", async () => {
        axios.get.mockResolvedValue({data: DEFAULT_USER_CONFIG});
        const {result} = renderHook(useAppState, {wrapper});

        act(() => result.current.selectUser("Stanley"));

        expect(result.current.user).toBe("Stanley");
        expect(sessionStorage.getItem("user")).toBe("Stanley");
        await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/api/user/Stanley/config"));
    });

    test("forgets a remembered user who no longer exists", async () => {
        sessionStorage.setItem("user", "Gone");
        axios.get.mockRejectedValue({response: {status: 404}});

        const {result} = renderHook(useAppState, {wrapper});

        await waitFor(() => expect(result.current.user).toBeNull());
        expect(sessionStorage.getItem("user")).toBeNull();
    });

    test("keeps the user and the default layout when the layout cannot be read", async () => {
        sessionStorage.setItem("user", "Stanley");
        axios.get.mockRejectedValue({response: {status: 500}});

        const {result} = renderHook(useAppState, {wrapper});

        await waitFor(() => expect(console.error).toHaveBeenCalled());
        expect(result.current.user).toBe("Stanley");
        expect(result.current.userConfig).toEqual(DEFAULT_USER_CONFIG);
    });

    test("holds the PDF target the recipe page publishes", () => {
        const {result} = renderHook(useAppState, {wrapper});
        const target = {ref: {current: null}, name: "Soup"};

        act(() => result.current.setPdfTarget(target));

        expect(result.current.pdfTarget).toBe(target);
    });

    test("refuses to be read outside its provider", () => {
        const Reader = () => <div>{useAppState().user}</div>;

        expect(() => render(<Reader/>)).toThrow("useAppState was called outside an AppStateProvider");
        expect(screen.queryByText("Stanley")).not.toBeInTheDocument();
    });
});
