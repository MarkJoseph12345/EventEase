package com.capstone.EventEase.Service;


import com.capstone.EventEase.DTO.Request.EmailSendRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EmailService {


    private final JavaMailSender javaMailSender;


    public String emailSend(List<EmailSendRequestDTO> emails){
        for(EmailSendRequestDTO email: emails){
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email.getReceiver());
            message.setText(email.getMessage());
            message.setSubject(email.getSubject());
            javaMailSender.send(message);
        }
        return "Email has been Sent!";
    }

}
