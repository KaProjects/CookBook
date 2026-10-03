import React from "react";
import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {Pages} from "../App";
import {ROUTER_FUTURE} from "../router";
import {AppStateProvider} from "../state/appState";
import {DEFAULT_APP_STATE} from "../testUtils";

jest.mock("../components/MainBar", () => () => <div>main bar</div>);
jest.mock("../views/Login", () => () => <div>login</div>);
jest.mock("../views/LoginShortcut", () => () => <div>login shortcut</div>);
jest.mock("../views/RecipeList", () => () => <div>recipe list</div>);
jest.mock("../views/Recipe", () => () => <div>recipe</div>);
jest.mock("../views/RecipeEditor", () => () => <div>editor</div>);

const show = (at, user = "Stanley") => render(
    <AppStateProvider value={{...DEFAULT_APP_STATE, user}}>
        <MemoryRouter initialEntries={[at]} future={ROUTER_FUTURE}><Pages/></MemoryRouter>
    </AppStateProvider>
);

describe("Pages", () => {
    test.each(["/", "/recipe/1", "/anything"])("shows the login at %s until a user is picked", (at) => {
        show(at, null);

        expect(screen.getByText("login")).toBeInTheDocument();
        expect(screen.queryByText("main bar")).not.toBeInTheDocument();
    });

    test("opens a login shortcut with or without a user", () => {
        show("/login/Anna", null);
        expect(screen.getByText("login shortcut")).toBeInTheDocument();
    });

    test.each([
        ["/", "recipe list"],
        ["/?category=Polievky", "recipe list"],
        ["/recipe/1", "recipe"],
        ["/recipe/1/edit", "editor"],
        ["/create", "editor"],
    ])("shows %s as the %s, under the main bar", (at, page) => {
        show(at);

        expect(screen.getByText(page)).toBeInTheDocument();
        expect(screen.getByText("main bar")).toBeInTheDocument();
    });

    test("answers an unknown address with 404", () => {
        show("/nothing/here");

        expect(screen.getByRole("heading", {name: "404 Page not found"})).toBeInTheDocument();
    });
});
