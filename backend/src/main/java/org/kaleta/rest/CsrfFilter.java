package org.kaleta.rest;

import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.kaleta.rest.error.Problem;

import java.util.Set;

/**
 * Refuses a state-changing request that another site could have caused the browser to make.
 * <p>
 * There is no login, so nothing but this stands between a request and the recipes: every page open
 * in the browser can send requests to the application, and the browser gives each one the same
 * access the application's own page has. A form on another site cannot set a header of its own,
 * and a script that tries has to ask permission first, through a preflight this application never
 * grants.
 * <p>
 * It is global so that every endpoint which can write is covered by the fact of existing, rather
 * than by somebody remembering.
 */
@Provider
// Runs before anything else reads the request, so a forged one is turned away untouched.
@Priority(Priorities.AUTHENTICATION - 100)
public class CsrfFilter implements ContainerRequestFilter
{
    public static final String CLIENT_HEADER = "X-Cookbook-Client";
    public static final String CLIENT_HEADER_VALUE = "web";

    private static final Set<String> UNSAFE_METHODS = Set.of("POST", "PUT", "PATCH", "DELETE");

    /**
     * Read when a request arrives rather than when the filter is made. The REST layer makes its
     * filters while the application is initialised, which a native build does at build time: a
     * value injected directly was looked up there - where the deployment's FRONTEND_ORIGIN does not
     * exist, failing the build, and where any value it did find would have been fixed into the
     * binary for good.
     */
    @ConfigProperty(name = "auth.frontend-origin")
    jakarta.inject.Provider<String> frontendOrigin;

    @Override
    public void filter(ContainerRequestContext requestContext)
    {
        if (!UNSAFE_METHODS.contains(requestContext.getMethod())) return;

        String origin = requestContext.getHeaderString("Origin");
        String client = requestContext.getHeaderString(CLIENT_HEADER);

        if (!frontendOrigin.get().equals(origin) || !CLIENT_HEADER_VALUE.equals(client))
        {
            requestContext.abortWith(Problem.of(Response.Status.FORBIDDEN,
                    "The request did not come from the application."));
        }
    }
}
