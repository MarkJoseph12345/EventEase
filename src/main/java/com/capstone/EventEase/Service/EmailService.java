package com.capstone.EventEase.Service;

import com.capstone.EventEase.DTO.Request.EmailSendRequestDTO;
import com.capstone.EventEase.Entity.Event;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
    import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
@RequiredArgsConstructor



public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private static final String ACTION_URL = "http://localhost:3000/Preregister";

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;


    public void emailSend(List<EmailSendRequestDTO> emails, List<String> pass, Event event) {
        int successCount = 0;
        int failureCount = 0;

        for (int i = 0; i < emails.size(); i++) {
            EmailSendRequestDTO email = emails.get(i);
          //  String password = pass.get(i);
            try {
                sendEmail(email,event);
                successCount++;
            } catch (Exception e) {
                logger.error("Failed to send email to {}: {}", email.getReceiver(), e.getMessage());
                failureCount++;
            }
        }

        logger.info("Emails sent successfully: {}", successCount);
        logger.info("Emails failed to send: {}", failureCount);
    }
    private void sendEmail(EmailSendRequestDTO email, Event event)  {
      try{
          Context context = new Context();
          context.setVariable("subject", "Event Invitation");
          context.setVariable("actionUrl", "http://localhost:3000/signup");
          context.setVariable("eventName", event.getEventName());
          context.setVariable("eventDescription", event.getEventDescription());
          context.setVariable("allowedGender", event.getAllowedGender().toString());
          context.setVariable("eventLimit", event.getEventLimit());

          String htmlContent = templateEngine.process("email-template", context);
          MimeMessage message = javaMailSender.createMimeMessage();
          MimeMessageHelper helper = new MimeMessageHelper(message, true);
          helper.setTo(email.getReceiver());
          helper.setSubject("Event Invitation");
          helper.setText(htmlContent, true);

          javaMailSender.send(message);
      }catch (MessagingException e){
          logger.error("Failed to send email to {}: {}", email.getReceiver(), e.getMessage());
      }
    }

    public void forgotPasswordEmail(String email, String token) {

     try{
         Context context = new Context();
         context.setVariable("subject","Forgot Password");
         context.setVariable("token",token);


         logger.info("The Token is: {}", token);

         String htmlContent = templateEngine.process("forgot-password",context);

         MimeMessage message = javaMailSender.createMimeMessage();
         MimeMessageHelper helper = new MimeMessageHelper(message,true);
         helper.setTo(email);
         helper.setSubject("Forgot Password Token");
         helper.setText(htmlContent,true);

         javaMailSender.send(message);
     }catch (MessagingException e){
         logger.error("Failed to send email to {}: {}", email, e.getMessage());
     }
    }


    public void sendConfirmationLink(String email, String token){
        try{
            Context context = new Context();
            context.setVariable("subject","Confirmation Link");
            context.setVariable("token",token);

            String htmlContent = templateEngine.process("confirm-template",context);


            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message,true);
            helper.setTo(email);
            helper.setSubject("Account Confirmation");
            helper.setText(htmlContent,true);


            javaMailSender.send(message);
        }catch (MessagingException e){
            logger.error("Failed to send email to {}: {}", email, e.getMessage());
        }
    }



    public void sendBlockEmail(String email) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(email);
            helper.setSubject("Account Blocked");

            String htmlContent = templateEngine.process("block-email-template", new Context());
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            logger.error("Failed to send block email to {}: {}", email, e.getMessage());
        }
    }

    public void sendUnblockEmail(String email) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(email);
            helper.setSubject("Account Unblocked");

            String htmlContent = templateEngine.process("unblock-email-template", new Context());
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            logger.error("Failed to send unblock email to {}: {}", email, e.getMessage());
        }
    }

    public void sendDeleteEmail(String email) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(email);
            helper.setSubject("Account Deleted");

            String htmlContent = templateEngine.process("delete-email-template", new Context());
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            logger.error("Failed to send delete email to {}: {}", email, e.getMessage());
        }
    }
}