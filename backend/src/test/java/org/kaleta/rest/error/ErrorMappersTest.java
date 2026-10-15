package org.kaleta.rest.error;

import jakarta.ws.rs.NotAllowedException;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;

/** The mappers on their own, for the failures no request in the suite can provoke. */
class ErrorMappersTest
{
    @Test
    void anUnexpectedFailureIsA500ThatShowsNothingOfItsInternals()
    {
        Response response = new UnexpectedExceptionMapper().toResponse(new IllegalStateException("secret internals"));

        Problem problem = (Problem) response.getEntity();
        assertThat(response.getStatus(), is(500));
        assertThat(response.getMediaType().toString(), is(Problem.MEDIA_TYPE));
        assertThat(problem.getDetail(), is("An unexpected error occurred."));
        assertThat(problem.getErrorId(), is(notNullValue()));
    }

    @Test
    void aRefusalCausedByAFailureIsLoggedUnderAnId()
    {
        ApiException refusal = new ApiException(Response.Status.SERVICE_UNAVAILABLE, "Try later.", new RuntimeException("db down")) {};

        Problem problem = (Problem) new ApiExceptionMapper().toResponse(refusal).getEntity();

        assertThat(problem.getStatus(), is(503));
        assertThat(problem.getDetail(), is("Try later."));
        assertThat(problem.getErrorId(), is(notNullValue()));
    }

    @Test
    void aPlainRefusalHasNoErrorId()
    {
        Problem problem = (Problem) new ApiExceptionMapper().toResponse(new InvalidInputException("Nope.")).getEntity();

        assertThat(problem.getStatus(), is(400));
        assertThat(problem.getTitle(), is("Bad Request"));
        assertThat(problem.getErrorId(), is(nullValue()));
    }

    @Test
    void theRestLayersOwnRefusalsKeepTheirStatus()
    {
        Response response = new WebApplicationExceptionMapper().toResponse(new NotAllowedException("GET"));

        assertThat(response.getStatus(), is(405));
        assertThat(((Problem) response.getEntity()).getDetail(), is("Method Not Allowed."));
    }

    @Test
    void aValidatorThatFailsIsA500InTheProblemShape()
    {
        Response response = new ValidationExceptionMapper().toResponse(new jakarta.validation.ValidationException("HV000028"));

        assertThat(response.getStatus(), is(500));
        assertThat(response.getMediaType().toString(), is(Problem.MEDIA_TYPE));
        assertThat(((Problem) response.getEntity()).getErrorId(), is(notNullValue()));
    }

    @Test
    void aBrokenConstraintThroughTheValidationMapperIsStillA400()
    {
        Response response = new ValidationExceptionMapper().toResponse(
                new jakarta.validation.ConstraintViolationException(java.util.Set.of()));

        assertThat(response.getStatus(), is(400));
    }
}
