package com.capstone.EventEase.DTO.Request;

import com.capstone.EventEase.ENUMS.Gender;
import lombok.Data;

@Data
public class RegisterRequest {


    private String username;

    private String password;


    private String firstName;




    private String lastName;

    private String idNumber;

    private String department;


    private Gender gender;


}
