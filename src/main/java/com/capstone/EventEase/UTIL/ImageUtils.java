package com.capstone.EventEase.UTIL;

import org.springframework.stereotype.Service;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.Deflater;
import java.util.zip.Inflater;
import javax.imageio.ImageIO;

@Service
public class ImageUtils {

    private static final Logger LOGGER = Logger.getLogger(ImageUtils.class.getName());
    private static final int MAX_IMAGE_SIZE = 300; // Maximum width or height in pixels

    public static byte[] compressImage(byte[] data) {
        Deflater deflater = new Deflater();
        deflater.setLevel(Deflater.BEST_COMPRESSION);
        deflater.setInput(data);
        deflater.finish();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[4*1024];
        while (!deflater.finished()) {
            int size = deflater.deflate(tmp);
            outputStream.write(tmp, 0, size);
        }

        try {
            outputStream.close();
        } catch (Exception ignored) {
        }
        return outputStream.toByteArray();
    }

    public static byte[] decompressImage(byte[] data) {
        Inflater inflater = new Inflater();
        inflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[4 * 1024];

        try {
            while (!inflater.finished()) {
                int count = inflater.inflate(tmp);
                outputStream.write(tmp, 0, count);
            }
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to decompress image data", e);
            return new byte[0]; // Return an empty array if decompression fails
        } finally {
            try {
                outputStream.close();
            } catch (Exception e) {
                LOGGER.log(Level.WARNING, "Failed to close the output stream", e);
            }
        }

        return outputStream.toByteArray();
    }

    public static byte[] resizeImage(byte[] imageData, String formatName) {
        try {
            BufferedImage img = ImageIO.read(new ByteArrayInputStream(imageData));
            if (img == null) {
                LOGGER.log(Level.WARNING, "Failed to read image data");
                return imageData;
            }

            int originalWidth = img.getWidth();
            int originalHeight = img.getHeight();

            if (originalWidth <= MAX_IMAGE_SIZE && originalHeight <= MAX_IMAGE_SIZE) {
                return imageData; // No need to resize
            }

            double scale = Math.min((double) MAX_IMAGE_SIZE / originalWidth, (double) MAX_IMAGE_SIZE / originalHeight);
            int newWidth = (int) (originalWidth * scale);
            int newHeight = (int) (originalHeight * scale);

            BufferedImage resizedImg = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
            Graphics2D g2d = resizedImg.createGraphics();
            g2d.drawImage(img, 0, 0, newWidth, newHeight, null);
            g2d.dispose();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(resizedImg, formatName, baos);
            return baos.toByteArray();

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to resize image", e);
            return imageData; // Return original data if resizing fails
        }
    }

    public static String compressAndEncodeImage(byte[] imageData, String formatName) {
        try {
            byte[] resizedImageData = resizeImage(imageData, formatName);
            byte[] compressedImageData = compressImage(resizedImageData);
            return Base64.getEncoder().encodeToString(compressedImageData);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to compress and encode image", e);
            return "";
        }
    }
}