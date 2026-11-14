import {formatVersion} from "../version";

describe("formatVersion", () => {
    test("drops a zero patch", () => {
        expect(formatVersion("2.4.0")).toBe("v2.4");
        expect(formatVersion("12.10.0")).toBe("v12.10");
    });

    test("keeps the dev suffix of a version not released yet", () => {
        expect(formatVersion("2.4.0-dev")).toBe("v2.4-dev");
    });

    test("shows a patch that is not zero", () => {
        expect(formatVersion("2.4.1")).toBe("v2.4.1");
        expect(formatVersion("2.4.10-dev")).toBe("v2.4.10-dev");
        expect(formatVersion("2.4.20")).toBe("v2.4.20");
    });

    test("shows nothing without a version it can read", () => {
        expect(formatVersion(undefined)).toBeNull();
        expect(formatVersion(null)).toBeNull();
        expect(formatVersion("")).toBeNull();
        expect(formatVersion("$npm_package_version")).toBeNull();
        expect(formatVersion("2.4")).toBeNull();
        expect(formatVersion("latest")).toBeNull();
    });
});
