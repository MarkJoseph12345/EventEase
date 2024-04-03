package com.capstone.EventEase.DTO.Response;

import com.capstone.EventEase.Entity.User;
import lombok.Data;

@Data
public class LoginResponse {


    private User user;

    private String token;


    public LoginResponse(User user, String token){
        this.user = user;
        this.token = token;
    }

}
