package org.kaleta.framework;

import io.restassured.http.ContentType;
import io.restassured.response.ValidatableResponse;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

/**
 * Assertions on the problem details every error of the API is answered with: the status, both in
 * the response and in its body, the title that goes with it, and the problem media type.
 */
public final class Problems
{
    private Problems() {}

    /** That the response is a problem of the given status and title. */
    public static ValidatableResponse assertProblem(ValidatableResponse response, int status, String title)
    {
        return response
                .statusCode(status)
                .contentType(containsString("application/problem+json"))
                .body("status", is(status))
                .body("title", is(title));
    }

    /** That a GET of the path is answered 404 Not Found. */
    public static ValidatableResponse assertNotFound(String path)
    {
        return assertProblem(given().when().get(path).then(), 404, "Not Found")
                .body("detail", notNullValue());
    }

    /** That posting the body to the path is refused as invalid, naming the field among the violations. */
    public static ValidatableResponse assertPostInvalid(String path, Object body, String field, String message)
    {
        return assertInvalid(given().contentType(ContentType.JSON).body(body).when().post(path).then(), field, message);
    }

    /** That putting the body to the path is refused as invalid, naming the field among the violations. */
    public static ValidatableResponse assertPutInvalid(String path, Object body, String field, String message)
    {
        return assertInvalid(given().contentType(ContentType.JSON).body(body).when().put(path).then(), field, message);
    }

    public static ValidatableResponse assertInvalid(ValidatableResponse response, String field, String message)
    {
        return assertProblem(response, 400, "Bad Request")
                .body("violations.field", hasItem(field))
                .body("violations.find { it.field == '" + field + "' }.message", containsString(message));
    }
}
