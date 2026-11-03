package org.kaleta.rest;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import org.junit.jupiter.api.Test;
import org.kaleta.SameOriginEveryTestRequest;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.kaleta.SameOriginEveryTestRequest.ORIGIN;
import static org.kaleta.rest.CsrfFilter.CLIENT_HEADER;
import static org.kaleta.rest.CsrfFilter.CLIENT_HEADER_VALUE;

/**
 * A state-changing request has to look like it came from this application's own page: the right
 * origin, and a header that a form on another site cannot set and a script cannot add without
 * first being granted a preflight this application never grants.
 */
@QuarkusTest
public class CsrfTest
{
    /**
     * Sends nothing of its own, so each case controls exactly what the request carries. The body is
     * empty, so a request the guard lets through is stopped by validation and writes nothing.
     */
    private RequestSpecification bare()
    {
        return given().noFiltersOfType(SameOriginEveryTestRequest.SameOrigin.class)
                .contentType(ContentType.JSON)
                .body("{}");
    }

    @Test
    public void anUnsafeRequestIsRefusedUnlessItCarriesBothTheOriginAndTheClientHeader()
    {
        Map<String, Map<String, String>> refused = Map.of(
                "nothing at all", Map.of(),
                "the origin alone", Map.of("Origin", ORIGIN),
                "the client header alone", Map.of(CLIENT_HEADER, CLIENT_HEADER_VALUE),
                "another site's origin", Map.of("Origin", "http://untrusted.test", CLIENT_HEADER, CLIENT_HEADER_VALUE),
                "the wrong client header", Map.of("Origin", ORIGIN, CLIENT_HEADER, "curl"));

        refused.forEach((description, headers) -> {
            RequestSpecification request = bare();
            headers.forEach(request::header);

            assertThat("expected to be refused with " + description,
                    request.when().post("/recipe")
                            .then().statusCode(403)
                            .extract().body().asString(),
                    containsString("did not come from the application"));
        });
    }

    @Test
    public void anUnsafeRequestThatCarriesBothIsLetThrough()
    {
        bare().header("Origin", ORIGIN)
                .header(CLIENT_HEADER, CLIENT_HEADER_VALUE)
                .when().post("/recipe")
                .then().statusCode(400);
    }

    @Test
    public void aSafeRequestIsNotSubjectToTheCheckAtAll()
    {
        given().noFiltersOfType(SameOriginEveryTestRequest.SameOrigin.class)
                .when().get("/user")
                .then().statusCode(200);
    }
}
