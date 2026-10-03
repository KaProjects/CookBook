package org.kaleta.rest.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * A picture as the browser reads a file: a base64 data URL, "data:image/png;base64,...".
 * Null is valid - a recipe need not have one. Whether the data really is a picture is only known
 * once it is decoded, which the image service does.
 */
@Documented
@Constraint(validatedBy = ImageValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidImage
{
    String message() default "must be a base64 image data URL";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
