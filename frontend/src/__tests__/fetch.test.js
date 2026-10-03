import {renderHook, waitFor} from "@testing-library/react";
import axios from "axios";
import {useData} from "../fetch";

jest.mock("axios");

describe("useData", () => {
    beforeEach(() => {
        axios.get.mockReset();
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => console.error.mockRestore());

    test("loads a path through the backend prefix", async () => {
        axios.get.mockResolvedValue({data: ["Stanley"]});

        const {result} = renderHook(() => useData("/user"));

        expect(result.current).toEqual({data: null, loaded: false, error: null});
        await waitFor(() => expect(result.current.loaded).toBe(true));
        expect(axios.get).toHaveBeenCalledWith("/api/user");
        expect(result.current.data).toEqual(["Stanley"]);
    });

    test("reports a failure and stays unloaded", async () => {
        const failure = new Error("Network Error");
        axios.get.mockRejectedValue(failure);

        const {result} = renderHook(() => useData("/user"));

        await waitFor(() => expect(result.current.error).toBe(failure));
        expect(result.current.loaded).toBe(false);
    });

    test("holds the request back until it is enabled, and when there is no path", async () => {
        axios.get.mockResolvedValue({data: {}});

        const {result, rerender} = renderHook(({path, enabled}) => useData(path, enabled), {
            initialProps: {path: "/menu", enabled: false},
        });
        rerender({path: null, enabled: true});
        expect(axios.get).not.toHaveBeenCalled();

        rerender({path: "/menu", enabled: true});
        await waitFor(() => expect(result.current.loaded).toBe(true));
        expect(axios.get).toHaveBeenCalledTimes(1);
    });

    test("never shows the answer of a previous path for a new one", async () => {
        axios.get.mockResolvedValueOnce({data: "first"});

        const {result, rerender} = renderHook(({path}) => useData(path), {initialProps: {path: "/recipe/1"}});
        await waitFor(() => expect(result.current.data).toBe("first"));

        let answer;
        axios.get.mockReturnValueOnce(new Promise((resolve) => { answer = resolve; }));
        rerender({path: "/recipe/2"});

        expect(result.current).toEqual({data: null, loaded: false, error: null});
        answer({data: "second"});
        await waitFor(() => expect(result.current.data).toBe("second"));
    });

    test("discards a slow answer that arrives after the path moved on", async () => {
        let slow;
        axios.get.mockReturnValueOnce(new Promise((resolve) => { slow = resolve; }));
        axios.get.mockResolvedValueOnce({data: "current"});

        const {result, rerender} = renderHook(({path}) => useData(path), {initialProps: {path: "/a"}});
        rerender({path: "/b"});
        await waitFor(() => expect(result.current.data).toBe("current"));

        slow({data: "stale"});
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(result.current.data).toBe("current");
    });
});
