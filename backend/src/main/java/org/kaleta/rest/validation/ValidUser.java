package org.kaleta.rest.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** The name of one of the configured users. */
@Documented
@Constraint(validatedBy = UserValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidUser
{
    String message() default "must be a known user";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
