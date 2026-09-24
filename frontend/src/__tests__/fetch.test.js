import {renderHook, waitFor} from "@testing-library/react";
import axios from "axios";
import {useData} from "../fetch";

jest.mock("axios");

describe("useData", () => {
    beforeEach(() => {
        axios.get.mockReset();
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    test("loads data from the backend prefix", async () => {
        axios.get.mockResolvedValue({data: ["user"]});

        const {result} = renderHook(() => useData("/user"));

        expect(result.current.loaded).toBe(false);
        await waitFor(() => expect(result.current.loaded).toBe(true));
        expect(axios.get).toHaveBeenCalledWith("/api/user");
        expect(result.current.data).toEqual(["user"]);
        expect(result.current.error).toBeNull();
    });

    test("reports errors and stays unloaded", async () => {
        const failure = new Error("Network Error");
        axios.get.mockRejectedValue(failure);

        const {result} = renderHook(() => useData("/user"));

        await waitFor(() => expect(result.current.error).toBe(failure));
        expect(result.current.loaded).toBe(false);
        expect(result.current.data).toBeNull();
    });

    test("fetches again when the path or deps change", async () => {
        axios.get.mockResolvedValue({data: {}});

        const {rerender} = renderHook(({path, deps}) => useData(path, deps), {
            initialProps: {path: "/a", deps: false},
        });
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

        rerender({path: "/b", deps: false});
        await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/api/b"));

        rerender({path: "/b", deps: true});
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
    });
});
