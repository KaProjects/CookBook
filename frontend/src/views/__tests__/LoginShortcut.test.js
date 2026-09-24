import React from "react";
import {render, screen} from "@testing-library/react";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import LoginShortcut from "../LoginShortcut";

describe("LoginShortcut", () => {
    test("logs in the user from the URL and goes home", () => {
        const setUser = jest.fn();

        render(
            <MemoryRouter initialEntries={["/login/Stanley"]}>
                <Routes>
                    <Route path="/login/:user" element={<LoginShortcut setUser={setUser}/>}/>
                    <Route path="/" element={<div>home</div>}/>
                </Routes>
            </MemoryRouter>
        );

        expect(setUser).toHaveBeenCalledWith("Stanley");
        expect(screen.getByText("home")).toBeInTheDocument();
    });
});
