package org.kaleta.rest.error;

import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

/**
 * Answers a failure of validation itself - a validator that threw, rather than a value that broke
 * a constraint - as the 500 it is, in the shape of every other error.
 * <p>
 * Hibernate Validator registers a mapper of its own for these, more specific than
 * {@link UnexpectedExceptionMapper}, which answered with the container's own JSON instead. The
 * native build once failed this way on every request that validated a recipe.
 */
@Provider
public class ValidationExceptionMapper implements ExceptionMapper<ValidationException>
{
    private final ConstraintViolationExceptionMapper violations = new ConstraintViolationExceptionMapper();
    private final UnexpectedExceptionMapper unexpected = new UnexpectedExceptionMapper();

    @Override
    public Response toResponse(ValidationException exception)
    {
        if (exception instanceof ConstraintViolationException violation) {
            return violations.toResponse(violation);
        }
        return unexpected.toResponse(exception);
    }
}
