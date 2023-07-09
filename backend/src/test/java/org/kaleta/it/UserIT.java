package org.kaleta.it;

import io.quarkus.test.junit.QuarkusIntegrationTest;
import org.kaleta.test.UserTest;

@QuarkusIntegrationTest
public class UserIT extends UserTest {
    // Execute the same tests but in packaged mode.
}
