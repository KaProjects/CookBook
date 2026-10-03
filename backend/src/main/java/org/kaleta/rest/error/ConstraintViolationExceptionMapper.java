package org.kaleta.rest.error;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Path;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.Comparator;
import java.util.List;

/**
 * Answers a request whose parameters failed validation as 400 Bad Request, listing each invalid
 * parameter by its name and what is wrong with it.
 */
@Provider
public class ConstraintViolationExceptionMapper implements ExceptionMapper<ConstraintViolationException>
{
    @Override
    public Response toResponse(ConstraintViolationException exception)
    {
        List<Problem.Violation> violations = exception.getConstraintViolations().stream()
                .map(violation -> new Problem.Violation(fieldOf(violation), violation.getMessage()))
                .sorted(Comparator.comparing(Problem.Violation::getField))
                .toList();

        Problem problem = new Problem(Response.Status.BAD_REQUEST, "The request is not valid.");
        problem.setViolations(violations);
        return problem.toResponse();
    }

    /**
     * Where in the request the value that failed is, such as {@code steps[0].number}. The path
     * also names the resource method and its parameter, which are of no use to a client - except
     * for a parameter that is itself the value, such as a path or query parameter.
     */
    static String fieldOf(ConstraintViolation<?> violation)
    {
        StringBuilder field = new StringBuilder();
        String parameter = null;
        for (Path.Node node : violation.getPropertyPath()) {
            switch (node.getKind()) {
                case METHOD, CONSTRUCTOR, RETURN_VALUE, CROSS_PARAMETER -> {}
                case PARAMETER -> parameter = node.getName();
                case CONTAINER_ELEMENT -> {
                    if (node.getIndex() != null) field.append('[').append(node.getIndex()).append(']');
                }
                default -> {
                    if (node.getIndex() != null && !field.isEmpty()) field.append('[').append(node.getIndex()).append(']');
                    if (node.getName() == null) break;
                    if (!field.isEmpty()) field.append('.');
                    field.append(node.getName());
                }
            }
        }
        return field.isEmpty() ? parameter : field.toString();
    }
}
