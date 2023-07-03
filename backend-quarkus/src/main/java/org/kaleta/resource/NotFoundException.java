package org.kaleta.resource;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

public class NotFoundException extends WebApplicationException {

    public NotFoundException(String message){
        super(Response.status(Response.Status.NOT_FOUND)
                .type(MediaType.TEXT_PLAIN)
                .entity(message)
                .build());
    }
}
