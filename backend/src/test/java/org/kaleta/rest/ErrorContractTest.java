package org.kaleta.rest;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.nullValue;
import static org.kaleta.framework.Problems.assertProblem;

/**
 * Every error is answered as problem details, whichever part of the application refuses: the REST
 * layer, validation or the application itself.
 */
@QuarkusTest
class ErrorContractTest
{
    @Test
    void aPathNothingServesIsNotFound()
    {
        assertProblem(given().when().get("/nothing/here").then(), 404, "Not Found");
    }

    @Test
    void aMethodAPathDoesNotAllowIsRefused()
    {
        assertProblem(given().when().delete("/recipe/1").then(), 405, "Method Not Allowed");
    }

    @Test
    void aBodyOfTheWrongTypeIsRefused()
    {
        assertProblem(given().contentType(ContentType.TEXT).body("hello").when().post("/recipe").then(), 415, "Unsupported Media Type");
    }

    @Test
    void malformedJsonIsABadRequest()
    {
        assertProblem(given().contentType(ContentType.JSON).body("{not json").when().post("/recipe").then(), 400, "Bad Request");
    }

    @Test
    void aProblemLeavesOutWhatItDoesNotHave()
    {
        assertProblem(given().when().get("/recipe/missing").then(), 404, "Not Found")
                .body("violations", nullValue())
                .body("errorId", nullValue());
    }
}
