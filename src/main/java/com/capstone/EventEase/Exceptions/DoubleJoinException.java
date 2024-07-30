package com.capstone.EventEase.Exceptions;

public class DoubleJoinException extends Exception{

    private String message;


    public DoubleJoinException(String message){
        super(message);
    }
}
