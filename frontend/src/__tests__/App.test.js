import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import axios from "axios";
import App from "../App";

jest.mock("axios");

jest.mock("../components/MainBar", () => (props) =>
    <div>bar:{props.user}:{props.userConfig ? props.userConfig.menuAnchor : "none"}</div>
);
jest.mock("../views/Login", () => () => <div>login</div>);
jest.mock("../views/LoginShortcut", () => () => <div>login shortcut</div>);
jest.mock("../views/RecipeList", () => () => <div>recipe list</div>);
jest.mock("../views/Recipe", () => (props) => <div>recipe:{props.selectedRecipeId}</div>);
jest.mock("../views/RecipeEditor", () => () => <div>editor</div>);

describe("App", () => {
    beforeEach(() => {
        sessionStorage.clear();
        window.history.pushState({}, "", "/");
        axios.get.mockReset();
        axios.get.mockResolvedValue({data: {menuAnchor: "left", recipeItemColor: "red"}});
    });

    test("shows the login page without a user", () => {
        render(<App/>);

        expect(screen.getByText("login")).toBeInTheDocument();
        expect(axios.get).not.toHaveBeenCalled();
    });

    test("shows the login shortcut route without a user", () => {
        window.history.pushState({}, "", "/login/Stanley");
        render(<App/>);

        expect(screen.getByText("login shortcut")).toBeInTheDocument();
    });

    test("restores the user from the session and loads their config", async () => {
        sessionStorage.setItem("user", "Stanley");

        render(<App/>);

        expect(screen.getByText("recipe list")).toBeInTheDocument();
        expect(axios.get).toHaveBeenCalledWith("/api/user/Stanley/config");
        expect(await screen.findByText("bar:Stanley:left")).toBeInTheDocument();
    });

    test("keeps working when the config request fails", async () => {
        jest.spyOn(console, "log").mockImplementation(() => {});
        sessionStorage.setItem("user", "Stanley");
        axios.get.mockRejectedValue(new Error("down"));

        render(<App/>);

        await waitFor(() => expect(console.log).toHaveBeenCalled());
        expect(screen.getByText("bar:Stanley:none")).toBeInTheDocument();
        console.log.mockRestore();
    });

    test("routes to the selected recipe restored from the session", () => {
        sessionStorage.setItem("user", "Stanley");
        sessionStorage.setItem("recipe", "7");
        window.history.pushState({}, "", "/recipe");

        render(<App/>);

        expect(screen.getByText("recipe:7")).toBeInTheDocument();
    });

    test.each(["/create", "/edit"])("routes %s to the editor", (path) => {
        sessionStorage.setItem("user", "Stanley");
        window.history.pushState({}, "", path);

        render(<App/>);

        expect(screen.getByText("editor")).toBeInTheDocument();
    });

    test("shows 404 for unknown routes", () => {
        sessionStorage.setItem("user", "Stanley");
        window.history.pushState({}, "", "/nope");

        render(<App/>);

        expect(screen.getByText("404 Page not found")).toBeInTheDocument();
    });
});
