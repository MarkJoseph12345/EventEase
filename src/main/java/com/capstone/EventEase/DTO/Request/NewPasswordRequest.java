package com.capstone.EventEase.DTO.Request;

import lombok.Data;

@Data
public class NewPasswordRequest {

    private String token;

    private String newPassword;

}
