package com.capstone.EventEase.Classes;

import java.security.SecureRandom;

public class PasswordGenerator {


    private static char[] concatenateArrays(char[]... arrays) {
        int length = 0;
        for (char[] array : arrays) {
            length += array.length;
        }

        char[] result = new char[length];
        int index = 0;
        for (char[] array : arrays) {
            for (char c : array) {
                result[index++] = c;
            }
        }

        return result;
    }


    public String generatePassword(int length){

        char[] lowercaseLetters = {
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
                'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
                'u', 'v', 'w', 'x', 'y', 'z'
        };

        char[] uppercaseLetters = {
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
                'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
                'U', 'V', 'W', 'X', 'Y', 'Z'
        };

        char[] specialCharacters = {
                '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
                '-', '=', '+', '[', ']', '{', '}', '\\', '|',
                ';', ':', '\'', '"', ',', '.', '/', '<', '>', '?'
        };
        char[] allCharacters = concatenateArrays(lowercaseLetters, uppercaseLetters, specialCharacters);


        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(allCharacters.length);
            password.append(allCharacters[index]);
        }

        return password.toString();
    }


}
