package com.capstone.EventEase.Service;

import com.capstone.EventEase.DTO.Request.EmailSendRequestDTO;
import com.capstone.EventEase.Entity.Event;
import jakarta.mail.internet.MimeMessage;
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
    private static final String ACTION_URL = "http://localhost:3000/Preregister"; // Update with your actual URL

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    public String emailSend(List<EmailSendRequestDTO> emails, Event event) {
        int successCount = 0;
        int failureCount = 0;

        for (EmailSendRequestDTO email : emails) {
            try {
                // Set up context for email template
                Context context = new Context();
                context.setVariable("subject", "EventEase Invite");
                context.setVariable("body", "You have been invited to an event");
                context.setVariable("actionUrl", ACTION_URL);
                context.setVariable("eventName", event.getEventName());
                context.setVariable("eventDescription", event.getEventDescription());
                context.setVariable("allowedGender", event.getAllowedGender().toString());
                context.setVariable("eventLimit", event.getEventLimit()); // Add event limit

                // Process email template
                String htmlContent = templateEngine.process("email-template", context);

                // Create and send email
                MimeMessage message = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true);
                helper.setTo(email.getReceiver());
                helper.setSubject(email.getSubject());
                helper.setText(htmlContent, true);

                javaMailSender.send(message);
                successCount++;
            } catch (Exception e) {
                logger.error("Failed to send email to {}: {}", email.getReceiver(), e.getMessage());
                failureCount++;
            }
        }
        return String.format("Emails sent successfully: %d, failed: %d", successCount, failureCount);
    }
}
