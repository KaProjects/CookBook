import axios from "axios";
import {createRecipe, paths, updateRecipe} from "../api";

jest.mock("axios");

describe("paths", () => {
    test("encode every part they are built from", () => {
        expect(paths.users()).toBe("/user");
        expect(paths.userConfig("Anna Mária")).toBe("/user/Anna%20M%C3%A1ria/config");
        expect(paths.menu("a/b")).toBe("/user/a%2Fb/menu");
        expect(paths.recipe("id?x")).toBe("/recipe/id%3Fx");
    });

    test("add only the recipe filters that are set", () => {
        expect(paths.recipes("Stanley")).toBe("/user/Stanley/recipes");
        expect(paths.recipes("Stanley", {category: "Hlavné jedlá"})).toBe("/user/Stanley/recipes?category=Hlavn%C3%A9+jedl%C3%A1");
        expect(paths.recipes("Stanley", {ingredient: "Soľ & korenie"})).toBe("/user/Stanley/recipes?ingredient=So%C4%BE+%26+korenie");
        expect(paths.recipes("Stanley", {category: "A", ingredient: "B"})).toBe("/user/Stanley/recipes?category=A&ingredient=B");
    });
});

describe("recipe writes", () => {
    beforeEach(() => {
        axios.post.mockReset();
        axios.put.mockReset();
    });

    test("create posts the recipe for the cook and answers what was stored", async () => {
        axios.post.mockResolvedValue({data: {id: "new"}});

        await expect(createRecipe("Stanley", {name: "Soup"})).resolves.toEqual({id: "new"});
        expect(axios.post).toHaveBeenCalledWith("/api/recipe", {name: "Soup", cook: "Stanley"});
    });

    test("update puts the recipe at its address", async () => {
        axios.put.mockResolvedValue({data: {id: "7"}});

        await expect(updateRecipe("7", {name: "Soup"})).resolves.toEqual({id: "7"});
        expect(axios.put).toHaveBeenCalledWith("/api/recipe/7", {name: "Soup"});
    });
});
