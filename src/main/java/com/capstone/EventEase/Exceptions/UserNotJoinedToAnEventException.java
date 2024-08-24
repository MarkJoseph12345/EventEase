package com.capstone.EventEase.Exceptions;

public class UserNotJoinedToAnEventException extends Exception{

    private String message;


    public UserNotJoinedToAnEventException(String message){
        super(message);
    }
}
