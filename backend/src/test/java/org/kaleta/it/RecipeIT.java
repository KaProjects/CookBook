package org.kaleta.it;

import io.quarkus.test.junit.QuarkusIntegrationTest;
import org.kaleta.rest.RecipeEndpointsTest;

@QuarkusIntegrationTest
public class RecipeIT extends RecipeEndpointsTest {
    // Execute the same tests but in packaged mode.
}
