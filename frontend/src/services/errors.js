/**
 * The human-readable part of a failed request, if there is one.
 *
 * The backend answers every error with problem details: a `detail` saying what went wrong, the
 * `violations` of a request that failed validation - each a field and what is wrong with it -
 * and, for a failure of the server itself, the `errorId` it was logged under, which is what to
 * quote when reporting it. A body in any other shape - plain text from the proxy in front of the
 * backend, say - is passed through as it is.
 */
export const errorDetail = (error) => {
    if (!error.response) return [error.code, error.message].filter(Boolean).join(" ")

    const body = error.response.data
    if (typeof body === "string") return body
    if (!body || typeof body !== "object") return ""

    const violations = (body.violations || []).map((violation) => violation.field + " " + violation.message)
    const detail = violations.length > 0 ? violations.join("; ") : (body.detail || body.title || "")
    return body.errorId ? detail + " (error id " + body.errorId + ")" : detail
}

/** A failed request as one line: the status, plus whatever the body managed to explain. */
export const describeResponseError = (error) => {
    if (!error.response) return errorDetail(error)

    const status = [error.response.status, error.response.statusText].filter(Boolean).join(" ")
    const detail = errorDetail(error)
    return detail ? status + ": " + detail : status
}
