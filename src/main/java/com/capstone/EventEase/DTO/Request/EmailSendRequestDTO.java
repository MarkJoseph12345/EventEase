package com.capstone.EventEase.DTO.Request;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmailSendRequestDTO {


    private String subject;
    private String message;
    private String receiver;


}
