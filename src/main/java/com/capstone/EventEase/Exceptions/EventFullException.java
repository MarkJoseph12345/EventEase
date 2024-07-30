package com.capstone.EventEase.Exceptions;

import javax.swing.plaf.basic.BasicDesktopIconUI;

public class EventFullException extends Exception{

    private String message;



    public EventFullException(String message){
       super(message);
    }
}
