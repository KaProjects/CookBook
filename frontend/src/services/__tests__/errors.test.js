import {describeResponseError, errorDetail} from "../errors";

const failed = (status, data, statusText = "") => ({response: {status, statusText, data}});

describe("errorDetail", () => {
    test("reads the detail of a problem", () => {
        expect(errorDetail(failed(404, {title: "Not Found", status: 404, detail: "Recipe 'x' does not exist."})))
            .toBe("Recipe 'x' does not exist.");
    });

    test("lists the violations of an invalid request instead of the generic detail", () => {
        expect(errorDetail(failed(400, {
            detail: "The request is not valid.",
            violations: [{field: "name", message: "must not be blank"}, {field: "steps[1].text", message: "must not be blank"}],
        }))).toBe("name must not be blank; steps[1].text must not be blank");
    });

    test("quotes the error id of a server failure", () => {
        expect(errorDetail(failed(500, {detail: "An unexpected error occurred.", errorId: "abc"})))
            .toBe("An unexpected error occurred. (error id abc)");
    });

    test("passes plain text through and survives an empty body", () => {
        expect(errorDetail(failed(502, "Bad Gateway from nginx"))).toBe("Bad Gateway from nginx");
        expect(errorDetail(failed(500, null))).toBe("");
        expect(errorDetail(failed(500, {title: "Internal Server Error"}))).toBe("Internal Server Error");
    });

    test("describes a request that got no answer at all", () => {
        expect(errorDetail({code: "ERR_NETWORK", message: "Network Error"})).toBe("ERR_NETWORK Network Error");
        expect(errorDetail({message: "timeout"})).toBe("timeout");
    });
});

describe("describeResponseError", () => {
    test("puts the status in front of the detail", () => {
        expect(describeResponseError(failed(404, {detail: "Gone."}, "Not Found"))).toBe("404 Not Found: Gone.");
        expect(describeResponseError(failed(500, null))).toBe("500");
        expect(describeResponseError({code: "ERR_NETWORK", message: "Network Error"})).toBe("ERR_NETWORK Network Error");
    });
});
