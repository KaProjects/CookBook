/**
 * The version as the top bar shows it: "v2.4" for a release, "v2.4-dev" before one, and the patch
 * only when it is not 0. Null when the build carries no version, or one it cannot read.
 */
export function formatVersion(version) {
    const match = /^(\d+)\.(\d+)\.(\d+)(-[0-9A-Za-z.-]+)?$/.exec(version ?? "");
    if (!match) return null;
    const [, major, minor, patch, suffix = ""] = match;
    return "v" + major + "." + minor + (patch === "0" ? "" : "." + patch) + suffix;
}

/** This build's version, formatted, or null. */
export const appVersion = formatVersion(process.env.REACT_APP_VERSION);
