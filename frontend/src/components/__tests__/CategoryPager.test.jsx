import React from "react";
import {fireEvent, screen, within} from "@testing-library/react";
import CategoryPager from "../CategoryPager";
import {renderPage} from "../../testUtils";

const categories = [
    {name: "Dezerty", recipes: [{id: 6, name: "Palacinky", hasImage: true, hasSteps: true}]},
    {name: "Hlavné jedlá", recipes: [
        {id: 3, name: "Bryndzové halušky", hasImage: true, hasSteps: true},
        {id: 18, name: "Grilovaný syr", hasImage: false, hasSteps: false},
    ]},
    {name: "Polievky", recipes: [{id: 1, name: "Kapustnica", hasImage: true, hasSteps: true}]},
];

const setup = (at = "/") => renderPage(<CategoryPager categories={categories}/>, {at});

const swipe = (element, from, to) => {
    fireEvent.touchStart(element, {touches: [{clientX: from[0], clientY: from[1]}]});
    fireEvent.touchEnd(element, {changedTouches: [{clientX: to[0], clientY: to[1]}]});
};

describe("CategoryPager", () => {
    describe("without a category", () => {
        test("lists the categories with how many recipes each has", () => {
            setup();

            const rows = within(screen.getByRole("list", {name: "Categories"})).getAllByRole("button");
            expect(rows).toHaveLength(3);
            expect(within(rows[1]).getByText("Hlavné jedlá")).toBeInTheDocument();
            expect(within(rows[1]).getByText("2 recipes")).toBeInTheDocument();
            expect(within(rows[0]).getByText("1 recipe")).toBeInTheDocument();
        });

        test("pictures each category with its first recipe that has a picture, or its initial", () => {
            const withoutPictures = [{name: "Šaláty", recipes: [{id: 8, name: "Šalát", hasImage: false, hasSteps: true}]}];
            renderPage(<CategoryPager categories={[...categories, ...withoutPictures]}/>);

            const rows = within(screen.getByRole("list", {name: "Categories"})).getAllByRole("button");
            expect(within(rows[1]).getByRole("img", {hidden: true})).toHaveAttribute("src", "/api/recipe/3/image?size=thumbnail");
            expect(within(rows[3]).queryByRole("img", {hidden: true})).not.toBeInTheDocument();
            expect(within(rows[3]).getByText("Š")).toBeInTheDocument();
        });

        test("opens the category tapped, keeping the ingredient filter", () => {
            setup("/?ingredient=Soľ");

            fireEvent.click(screen.getByRole("button", {name: /Hlavné jedlá/}));

            expect(screen.getByTestId("location")).toHaveTextContent("/?ingredient=So%C4%BE&category=Hlavn%C3%A9+jedl%C3%A1");
        });

        test("lists the categories when the one in the address does not exist", () => {
            setup("/?category=Gone");
            expect(screen.getByRole("list", {name: "Categories"})).toBeInTheDocument();
        });
    });

    describe("with a category", () => {
        const at = "/?category=Hlavn%C3%A9+jedl%C3%A1";

        test("shows only that category's recipes, flagging those without steps", () => {
            setup(at);

            const rows = within(screen.getByRole("list", {name: "Recipes in Hlavné jedlá"})).getAllByRole("button");
            expect(rows).toHaveLength(2);
            expect(within(rows[0]).getByText("Bryndzové halušky")).toBeInTheDocument();
            expect(within(rows[1]).getByText("Grilovaný syr")).toBeInTheDocument();
            expect(within(rows[1]).getByText("No steps yet")).toBeInTheDocument();
            expect(within(rows[0]).getByRole("img", {hidden: true})).toHaveAttribute("src", "/api/recipe/3/image?size=thumbnail");
            expect(within(rows[0]).getByRole("img", {hidden: true})).toHaveAttribute("loading", "lazy");
            expect(within(rows[1]).queryByRole("img", {hidden: true})).not.toBeInTheDocument();
            expect(within(rows[1]).getByText("G")).toBeInTheDocument();
            expect(screen.queryByText("Palacinky")).not.toBeInTheDocument();
            expect(within(screen.getByRole("navigation", {name: "Category pages"})).getByText("2 / 3 · 2 recipes")).toBeInTheDocument();
        });

        test("opens the recipe tapped", () => {
            setup(at);

            fireEvent.click(screen.getByRole("button", {name: /Bryndzové halušky/}));

            expect(screen.getByTestId("location")).toHaveTextContent("/recipe/3");
        });

        test("swipes left to the next category and right to the previous", () => {
            setup(at);

            swipe(screen.getByRole("region", {name: "Hlavné jedlá"}), [300, 200], [100, 210]);
            expect(screen.getByTestId("location")).toHaveTextContent("/?category=Polievky");
            expect(screen.getByRole("region", {name: "Polievky"})).toHaveClass("slide-from-right");

            swipe(screen.getByRole("region", {name: "Polievky"}), [100, 200], [300, 190]);
            expect(screen.getByTestId("location")).toHaveTextContent("/?category=Hlavn%C3%A9+jedl%C3%A1");
            expect(screen.getByRole("region", {name: "Hlavné jedlá"})).toHaveClass("slide-from-left");
        });

        test("ignores short swipes and scrolling up or down", () => {
            setup(at);
            const page = screen.getByRole("region", {name: "Hlavné jedlá"});

            swipe(page, [200, 200], [170, 200]);
            swipe(page, [200, 100], [120, 400]);

            expect(screen.getByTestId("location")).toHaveTextContent("/?category=Hlavn%C3%A9+jedl%C3%A1");
        });

        test("stops at the first and the last category", () => {
            setup("/?category=Polievky");

            swipe(screen.getByRole("region", {name: "Polievky"}), [300, 200], [100, 200]);

            expect(screen.getByTestId("location")).toHaveTextContent("/?category=Polievky");
            expect(screen.getByRole("button", {name: "No next category"})).toBeDisabled();
        });

        test("moves with the arrows too, for anyone who cannot swipe", () => {
            setup(at);

            fireEvent.click(screen.getByRole("button", {name: "Previous category: Dezerty"}));

            expect(screen.getByTestId("location")).toHaveTextContent("/?category=Dezerty");
            expect(screen.getByRole("button", {name: "No previous category"})).toBeDisabled();
        });

        test("opened from the list, does not slide in", () => {
            setup(at);
            expect(screen.getByRole("region", {name: "Hlavné jedlá"})).not.toHaveClass("slide-from-right");
        });
    });
});
