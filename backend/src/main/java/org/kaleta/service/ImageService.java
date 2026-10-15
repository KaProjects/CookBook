package org.kaleta.service;

import jakarta.enterprise.context.ApplicationScoped;
import org.kaleta.rest.error.InvalidInputException;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.Base64;
import java.util.regex.Pattern;

/**
 * Turns an uploaded picture into the JPEG data URL a recipe stores: scaled down to a size a
 * recipe page can use, and compressed.
 */
@ApplicationScoped
public class ImageService
{
    public static final String JPEG_PREFIX = "data:image/jpeg;base64,";

    /** Phone photos are several thousand pixels wide; a recipe page never shows more than this. */
    static final int MAX_DIMENSION = 1600;

    static final float QUALITY = 0.7f;

    private static final Pattern WHITESPACE = Pattern.compile("\\s+");

    /**
     * @param dataUrl a base64 data URL of a picture in any format the JDK reads
     * @return the picture as a JPEG data URL
     * @throws InvalidInputException when the data is not a picture
     */
    public String toJpeg(String dataUrl)
    {
        return JPEG_PREFIX + Base64.getEncoder().encodeToString(toJpegBytes(dataUrl, MAX_DIMENSION));
    }

    /**
     * @param dataUrl a stored picture
     * @param maxDimension the longest side it is scaled down to, if it is longer
     * @return the picture as JPEG bytes
     */
    public byte[] toJpegBytes(String dataUrl, int maxDimension)
    {
        BufferedImage source = decode(dataUrl);
        double scale = Math.min(1.0, (double) maxDimension / Math.max(source.getWidth(), source.getHeight()));
        BufferedImage image = flatten(source, (int) Math.round(source.getWidth() * scale), (int) Math.round(source.getHeight() * scale));
        return encode(image);
    }

    /** The bytes a data URL holds, as they are. */
    public byte[] bytesOf(String dataUrl)
    {
        int comma = dataUrl.indexOf(',');
        if (comma < 0) throw new InvalidInputException("The image is not a data URL.");
        return Base64.getDecoder().decode(WHITESPACE.matcher(dataUrl.substring(comma + 1)).replaceAll(""));
    }

    /**
     * The type of picture the bytes are, read from their first bytes rather than taken from the data
     * URL: pictures stored before 2.2 were compressed to JPEG but kept the prefix they were uploaded
     * with.
     */
    public static String mediaTypeOf(byte[] bytes)
    {
        if (bytes.length > 2 && (bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xD8) return "image/jpeg";
        if (bytes.length > 3 && (bytes[0] & 0xFF) == 0x89 && bytes[1] == 'P' && bytes[2] == 'N' && bytes[3] == 'G') return "image/png";
        return "application/octet-stream";
    }

    private BufferedImage decode(String dataUrl)
    {
        int comma = dataUrl.indexOf(',');
        if (comma < 0) throw new InvalidInputException("The image is not a data URL.");
        try {
            // Line breaks are tolerated, as some encoders wrap base64; anything else that is not
            // base64 is refused rather than skipped, as the lenient MIME decoder would.
            byte[] bytes = Base64.getDecoder().decode(WHITESPACE.matcher(dataUrl.substring(comma + 1)).replaceAll(""));
            BufferedImage image = ImageIO.read(new ByteArrayInputStream(bytes));
            if (image == null) throw new InvalidInputException("The image is not a picture in a supported format.");
            return image;
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("The image is not valid base64.");
        } catch (IOException e) {
            throw new InvalidInputException("The image could not be read.");
        }
    }

    /**
     * Draws the picture onto an opaque RGB canvas of the given size. JPEG has no transparency,
     * and the JDK's JPEG writer refuses an image with an alpha channel outright, so a transparent
     * PNG - a screenshot, say - failed to upload. Transparent areas become white.
     */
    private static BufferedImage flatten(BufferedImage source, int width, int height)
    {
        BufferedImage target = new BufferedImage(Math.max(width, 1), Math.max(height, 1), BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = target.createGraphics();
        try {
            graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
            graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
            graphics.setColor(Color.WHITE);
            graphics.fillRect(0, 0, target.getWidth(), target.getHeight());
            graphics.drawImage(source, 0, 0, target.getWidth(), target.getHeight(), null);
        } finally {
            graphics.dispose();
        }
        return target;
    }

    private static byte[] encode(BufferedImage image)
    {
        ImageWriter writer = ImageIO.getImageWritersByFormatName("jpeg").next();
        try (ByteArrayOutputStream bytes = new ByteArrayOutputStream();
             ImageOutputStream output = ImageIO.createImageOutputStream(bytes)) {
            writer.setOutput(output);
            ImageWriteParam params = writer.getDefaultWriteParam();
            params.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            params.setCompressionQuality(QUALITY);
            writer.write(null, new IIOImage(image, null, null), params);
            output.flush();
            return bytes.toByteArray();
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        } finally {
            writer.dispose();
        }
    }
}
