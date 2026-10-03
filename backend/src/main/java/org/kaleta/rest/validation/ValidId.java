package org.kaleta.rest.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.ReportAsSingleViolation;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** An entity ID: a UUID, or one of the short IDs the older rows were created with. */
@Documented
@Constraint(validatedBy = {})
@NotBlank
@Size(max = 36)
@Pattern(regexp = "[A-Za-z0-9-]+")
@ReportAsSingleViolation
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidId
{
    String message() default "must be a valid entity ID";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
