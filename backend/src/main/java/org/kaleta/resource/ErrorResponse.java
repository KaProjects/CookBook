package org.kaleta.resource;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

public class ErrorResponse {

    public static WebApplicationException notFound(String message){
        return new WebApplicationException(Response
                .status(Response.Status.NOT_FOUND)
                .type(MediaType.TEXT_PLAIN)
                .entity(message)
                .build());
    }

    public static WebApplicationException badRequest(String message){
        return new WebApplicationException(Response
                .status(Response.Status.BAD_REQUEST)
                .type(MediaType.TEXT_PLAIN)
                .entity(message)
                .build());
    }
}
