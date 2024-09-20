package com.capstone.EventEase.UTIL;

import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.Deflater;
import java.util.zip.Inflater;



@Service
public class ImageUtils {



    private static final Logger LOGGER = Logger.getLogger(ImageUtils.class.getName());

    public static byte[] compressImage(byte[] data){

        Deflater deflater = new Deflater();
        deflater.setLevel(Deflater.BEST_COMPRESSION);
        deflater.setInput(data);
        deflater.finish();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[4*1024];
        while(!deflater.finished()){
            int size = deflater.deflate(tmp);
            outputStream.write(tmp,0,size);
        }

        try{
            outputStream.close();
        }catch (Exception ignored){

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

}
