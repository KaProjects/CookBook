package org.kaleta.it;

import io.quarkus.test.junit.QuarkusIntegrationTest;
import org.kaleta.rest.UserEndpointsTest;

@QuarkusIntegrationTest
public class UserIT extends UserEndpointsTest {
    // Execute the same tests but in packaged mode.
}
