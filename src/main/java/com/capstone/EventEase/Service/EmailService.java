package com.capstone.EventEase.Service;

import com.capstone.EventEase.DTO.Request.EmailSendRequestDTO;
import com.capstone.EventEase.Entity.Event;
import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Repository.UserRepository;
import com.capstone.EventEase.UTIL.ImageUtils;
import jakarta.mail.MessagingException;
import jakarta.mail.SendFailedException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.eclipse.angus.mail.smtp.SMTPAddressFailedException;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
    import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.UnsupportedEncodingException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private static  String ACTION_URL = "";
    private static final ZoneId UTC_8 = ZoneId.of("Asia/Singapore");

    private final UserRepository userRepository;
    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    public static String getActionUrl() {
        return ACTION_URL;
    }

    public static void setActionUrl(String actionUrl) {
        ACTION_URL = actionUrl;
    }
    private boolean getUserByUsername(String username){
        User user = userRepository.findByUsername(username);
        return user != null;
    }

    public void emailSend(List<EmailSendRequestDTO> emails, Event event) {
        int successCount = 0;
        int failureCount = 0;

        for (int i = 0; i < emails.size(); i++) {
            EmailSendRequestDTO email = emails.get(i);
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

    public void emailUpdateSend(List<EmailSendRequestDTO> emails, Event event) {
        int successCount = 0;
        int failureCount = 0;

        for (int i = 0; i < emails.size(); i++) {
            EmailSendRequestDTO email = emails.get(i);
            try {
                updateEmailSend(email,event);
                successCount++;
            } catch (Exception e) {
                logger.error("Failed to send email to {}: {}", email.getReceiver(), e.getMessage());
                failureCount++;
            }
        }


        logger.info("Emails sent successfully: {}", successCount);
        logger.info("Emails failed to send: {}", failureCount);
    }




    private void updateEmailSend(EmailSendRequestDTO email, Event event) throws SendFailedException {
        try{
            Context context = new Context();
            context.setVariable("subject", "Event Update");
            context.setVariable("eventName", event.getEventName());
            context.setVariable("eventDescription", event.getEventDescription());
            context.setVariable("allowedGender", event.getAllowedGender().toString());
            context.setVariable("eventLimit", event.getEventLimit());
         //   context.setVariable("location", event.getLocation());
            context.setVariable("actionUrl", "https://eventease-five.vercel.app/Login");


            ZonedDateTime eventStarts = event.getEventStarts().atZoneSameInstant(UTC_8);
            ZonedDateTime eventEnds = event.getEventEnds().atZoneSameInstant(UTC_8);
            context.setVariable("eventStarts", eventStarts);
            context.setVariable("eventEnds", eventEnds);

            String htmlContent = templateEngine.process("updateEvent-template", context);
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // helper.addInline("eventPicture", dataSource);
            helper.setFrom("eventease2002@gmail.com", "EventEase");
            helper.setTo(email.getReceiver());
            helper.setSubject("Event Update");
            helper.setText(htmlContent, true);

            javaMailSender.send(message);

        } catch (MessagingException e) {
            logger.error("Failed to send email to {}: {}", email.getReceiver(), e.getMessage());
            throw new SendFailedException("Custom message: Failed to send email to " + email.getReceiver(), e);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }


    private void sendEmail(EmailSendRequestDTO email, Event event) throws MessagingException {
        try {
            Context context = new Context();
            context.setVariable("subject", "Event Invitation");
            context.setVariable("eventName", event.getEventName());
            context.setVariable("eventDescription", event.getEventDescription());
            context.setVariable("allowedGender", event.getAllowedGender().toString());
            context.setVariable("eventLimit", event.getEventLimit());

            String actionUrl = getUserByUsername(email.getReceiver())
                    ? "https://eventease-five.vercel.app/Login"
                    : "https://eventease-five.vercel.app/SignUp";
            context.setVariable("actionUrl", actionUrl);

            ZonedDateTime eventStarts = event.getEventStarts().atZoneSameInstant(UTC_8);
            ZonedDateTime eventEnds = event.getEventEnds().atZoneSameInstant(UTC_8);
            context.setVariable("eventStarts", eventStarts);
            context.setVariable("eventEnds", eventEnds);

            String htmlContent = templateEngine.process("email-template", context);

            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("eventease2002@gmail.com", "EventEase");
            helper.setTo(email.getReceiver());
            helper.setSubject("Event Invitation");
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (SMTPAddressFailedException e) {
            logger.error("Invalid email address: {}. Error: {}", email.getReceiver(), e.getMessage());
            throw new MessagingException("Invalid email address: " + email.getReceiver(), e);
        } catch (MessagingException | UnsupportedEncodingException e) {
            logger.error("Failed to send email to {}: {}", email.getReceiver(), e.getMessage());
            throw new MessagingException("Failed to send email to " + email.getReceiver(), e);
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
         helper.setFrom("eventease2002@gmail.com", "EventEase");
         helper.setTo(email);
         helper.setSubject("Forgot Password Token");
         helper.setText(htmlContent,true);

         javaMailSender.send(message);
     }catch (MessagingException e){
         logger.error("Failed to send email to {}: {}", email, e.getMessage());
     } catch (UnsupportedEncodingException e) {
         throw new RuntimeException(e);
     }
    }





    public void sendConfirmationLink(String email, String token) throws MessagingException {
        try {
            Context context = new Context();
            context.setVariable("subject", "Confirmation Link");
            context.setVariable("token", token);

            String htmlContent = templateEngine.process("confirm-template", context);

            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("eventease2002@gmail.com", "EventEase");
            helper.setTo(email);
            helper.setSubject("Account Confirmation");
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (SMTPAddressFailedException e) {
            logger.error("Invalid email address: {}. Error: {}", email, e.getMessage());
            throw new MessagingException("Invalid email address: " + email, e);
        } catch (MessagingException | UnsupportedEncodingException e) {
            logger.error("Failed to send email to {}: {}", email, e.getMessage());
            throw new MessagingException("Failed to send email to " + email, e);
        }
    }





    public void sendBlockEmail(String email) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("eventease2002@gmail.com", "EventEase");
            helper.setTo(email);
            helper.setSubject("Account Blocked");

            String htmlContent = templateEngine.process("block-email-template", new Context());
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            logger.error("Failed to send block email to {}: {}", email, e.getMessage());
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendUnblockEmail(String email) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("eventease2002@gmail.com", "EventEase");
            helper.setTo(email);
            helper.setSubject("Account Unblocked");

            String htmlContent = templateEngine.process("unblock-email-template", new Context());
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            logger.error("Failed to send unblock email to {}: {}", email, e.getMessage());
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }


    public void sendDeleteEmail(String email) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(email);
            helper.setSubject("Account Deleted");
            helper.setFrom("eventease2002@gmail.com", "EventEase");

            String htmlContent = templateEngine.process("delete-email-template", new Context());
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            logger.error("Failed to send delete email to {}: {}", email, e.getMessage());
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}
