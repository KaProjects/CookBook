package org.kaleta.rest.error;

import jakarta.ws.rs.core.Response;

/**
 * A request that is well-formed but cannot be acted on, such as an image that is not a picture:
 * 400 Bad Request. The detail says what is wrong with it.
 */
public class InvalidInputException extends ApiException
{
    public InvalidInputException(String detail)
    {
        super(Response.Status.BAD_REQUEST, detail);
    }
}
