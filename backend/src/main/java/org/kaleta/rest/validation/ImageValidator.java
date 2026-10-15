package org.kaleta.rest.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class ImageValidator implements ConstraintValidator<ValidImage, String>
{
    /** Only the header is matched: the payload can be megabytes long. */
    private static final Pattern HEADER = Pattern.compile("data:image/[a-z0-9.+-]+;base64,", Pattern.CASE_INSENSITIVE);

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context)
    {
        if (value == null) return true;
        int comma = value.indexOf(',');
        return comma > 0 && comma < value.length() - 1 && HEADER.matcher(value.substring(0, comma + 1)).matches();
    }
}
