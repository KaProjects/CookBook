package org.kaleta.rest.validation;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

class ImageValidatorTest
{
    private final ImageValidator validator = new ImageValidator();

    @ParameterizedTest
    @NullSource
    @ValueSource(strings = {"data:image/png;base64,AA==", "data:image/jpeg;base64,/9j/", "DATA:IMAGE/SVG+XML;BASE64,PHN2Zz4="})
    void acceptsImageDataUrlsAndNoImage(String value)
    {
        assertThat(validator.isValid(value, null), is(true));
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "AA==", "data:image/png;base64,", "data:text/plain;base64,AA==", "data:image/png,AA==",
            "http://example.com/a.png", "data:image/png;base64AA=="})
    void refusesAnythingElse(String value)
    {
        assertThat(validator.isValid(value, null), is(false));
    }
}
