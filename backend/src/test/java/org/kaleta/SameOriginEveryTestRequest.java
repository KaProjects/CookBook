package org.kaleta;

import io.quarkus.test.junit.callback.QuarkusTestBeforeEachCallback;
import io.quarkus.test.junit.callback.QuarkusTestMethodContext;
import io.restassured.RestAssured;
import io.restassured.filter.Filter;
import io.restassured.filter.FilterContext;
import io.restassured.response.Response;
import io.restassured.specification.FilterableRequestSpecification;
import io.restassured.specification.FilterableResponseSpecification;

import java.util.Set;

import static org.kaleta.rest.CsrfFilter.CLIENT_HEADER;
import static org.kaleta.rest.CsrfFilter.CLIENT_HEADER_VALUE;

/**
 * Makes every unsafe request of every {@code @QuarkusTest} look like it came from the application's
 * own page, which is what the cross-site request guard lets through.
 * <p>
 * Registered through {@code META-INF/services}, so the test classes that predate the guard need no
 * change, and a new one passes it by default rather than by remembering to.
 */
public class SameOriginEveryTestRequest implements QuarkusTestBeforeEachCallback
{
    /** Matches auth.frontend-origin in the test configuration. */
    public static final String ORIGIN = "http://cookbook.test";

    @Override
    public void beforeEach(QuarkusTestMethodContext context)
    {
        if (RestAssured.filters().stream().noneMatch(filter -> filter instanceof SameOrigin))
        {
            RestAssured.filters(new SameOrigin());
        }
    }

    public static class SameOrigin implements Filter
    {
        private static final Set<String> UNSAFE_METHODS = Set.of("POST", "PUT", "PATCH", "DELETE");

        @Override
        public Response filter(FilterableRequestSpecification requestSpec,
                               FilterableResponseSpecification responseSpec,
                               FilterContext context)
        {
            if (UNSAFE_METHODS.contains(requestSpec.getMethod()))
            {
                requestSpec.removeHeader("Origin");
                requestSpec.removeHeader(CLIENT_HEADER);
                requestSpec.header("Origin", ORIGIN);
                requestSpec.header(CLIENT_HEADER, CLIENT_HEADER_VALUE);
            }
            return context.next(requestSpec, responseSpec);
        }
    }
}
