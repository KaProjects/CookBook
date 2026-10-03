package org.kaleta.service;

import org.junit.jupiter.api.Test;
import org.kaleta.framework.Generator;
import org.kaleta.rest.error.InvalidInputException;

import java.awt.image.BufferedImage;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.lessThan;
import static org.junit.jupiter.api.Assertions.assertThrows;

/** Plain unit tests: the image service needs nothing injected. */
class ImageServiceTest
{
    private final ImageService imageService = new ImageService();

    @Test
    void reencodesAsJpegKeepingTheSize()
    {
        String jpeg = imageService.toJpeg(Generator.image("bmp", 64, 48));

        assertThat(Generator.isJpeg(jpeg), is(true));
        BufferedImage image = Generator.decode(jpeg);
        assertThat(image.getWidth(), is(64));
        assertThat(image.getHeight(), is(48));
    }

    @Test
    void acceptsTransparentPictures()
    {
        // The JDK's JPEG writer refuses an alpha channel, which is how a screenshot failed to upload.
        String jpeg = imageService.toJpeg(Generator.image("png", 40, 30));

        assertThat(Generator.isJpeg(jpeg), is(true));
        assertThat(Generator.decode(jpeg).getColorModel().hasAlpha(), is(false));
    }

    @Test
    void scalesLargePicturesDownKeepingTheirShape()
    {
        BufferedImage wide = Generator.decode(imageService.toJpeg(Generator.image("bmp", 3200, 1000)));
        assertThat(wide.getWidth(), is(ImageService.MAX_DIMENSION));
        assertThat(wide.getHeight(), is(500));

        BufferedImage tall = Generator.decode(imageService.toJpeg(Generator.image("bmp", 900, 2400)));
        assertThat(tall.getWidth(), is(600));
        assertThat(tall.getHeight(), is(ImageService.MAX_DIMENSION));
    }

    @Test
    void compresses()
    {
        String original = Generator.image("bmp", 400, 300);
        assertThat(imageService.toJpeg(original).length(), is(lessThan(original.length())));
    }

    @Test
    void acceptsBase64WrappedOverSeveralLines()
    {
        String image = Generator.image("bmp", 8, 8);
        String wrapped = image.substring(0, 40) + "\r\n" + image.substring(40);

        assertThat(Generator.isJpeg(imageService.toJpeg(wrapped)), is(true));
    }

    @Test
    void refusesWhatIsNotAPicture()
    {
        assertThat(assertThrows(InvalidInputException.class, () -> imageService.toJpeg("no comma")).getMessage(),
                is("The image is not a data URL."));
        assertThat(assertThrows(InvalidInputException.class, () -> imageService.toJpeg("data:image/png;base64,***")).getMessage(),
                is("The image is not valid base64."));
        assertThat(assertThrows(InvalidInputException.class, () -> imageService.toJpeg("data:image/png;base64,aGVsbG8=")).getMessage(),
                is("The image is not a picture in a supported format."));
    }
}
