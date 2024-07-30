package com.capstone.EventEase.Exceptions;

public class UserBlockedException extends Exception{

    private String message;


        public UserBlockedException(String message){
            super(message);
        }
}
