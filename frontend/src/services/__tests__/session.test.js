import {loadUser, saveUser} from "../session";

describe("session", () => {
    beforeEach(() => sessionStorage.clear());

    test("remembers the user for the tab", () => {
        expect(loadUser()).toBeNull();
        saveUser("Stanley");
        expect(loadUser()).toBe("Stanley");
        saveUser(null);
        expect(loadUser()).toBeNull();
    });

    test("carries on when storage is unavailable", () => {
        const getItem = jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("denied"); });
        const setItem = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("denied"); });

        expect(loadUser()).toBeNull();
        expect(() => saveUser("Stanley")).not.toThrow();

        getItem.mockRestore();
        setItem.mockRestore();
    });
});
