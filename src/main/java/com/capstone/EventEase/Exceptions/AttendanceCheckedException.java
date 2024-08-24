package com.capstone.EventEase.Exceptions;

import com.capstone.EventEase.Entity.Attendance;

public class AttendanceCheckedException extends Exception{

    private String message;

    public AttendanceCheckedException(String message){
        super(message);
    }
}


