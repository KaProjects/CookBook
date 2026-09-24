import {properties} from "../properties";

// The bundle must call the same-origin /api prefix: nginx (deploy/nginx.conf)
// and setupProxy.js both strip it and forward to the backend.

describe("properties", () => {
    it("points the backend at the same-origin /api proxy", () => {
        expect(properties.backend).toBe("/api")
    })
})
