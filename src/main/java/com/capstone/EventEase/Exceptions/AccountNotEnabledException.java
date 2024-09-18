package com.capstone.EventEase.Exceptions;

public class AccountNotEnabledException extends Exception{

    private String message;

    public AccountNotEnabledException(String message){
        super(message);
    }
}
