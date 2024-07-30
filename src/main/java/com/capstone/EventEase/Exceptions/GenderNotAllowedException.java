package com.capstone.EventEase.Exceptions;

public class GenderNotAllowedException extends Exception{

    private String message;


    public GenderNotAllowedException(String message){
        super(message);
    }
}
