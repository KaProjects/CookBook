package org.kaleta.rest.validation;

import jakarta.inject.Inject;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.kaleta.service.UserService;

public class UserValidator implements ConstraintValidator<ValidUser, String>
{
    @Inject
    UserService userService;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context)
    {
        return value != null && userService.exists(value);
    }
}
