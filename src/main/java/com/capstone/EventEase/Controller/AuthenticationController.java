package com.capstone.EventEase.Controller;


import com.capstone.EventEase.DTO.Request.ForgotPasswordRequest;
import com.capstone.EventEase.DTO.Request.LoginRequest;
import com.capstone.EventEase.DTO.Request.NewPasswordRequest;
import com.capstone.EventEase.DTO.Request.RegisterRequest;
import com.capstone.EventEase.DTO.Response.LoginResponse;
import com.capstone.EventEase.Entity.Event;
import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Service.AuthenticationService;
import com.capstone.EventEase.Service.EventService;
import com.capstone.EventEase.Service.PasswordResetTokenService;
import com.capstone.EventEase.Service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/")
@RequiredArgsConstructor
@Tag(name = "AUTHENTICATION CONTROLLER", description = "THIS IS THE AUTHENTICATION CONTROLLER")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    private final PasswordResetTokenService passwordResetTokenService;

    private final EventService eventService;






    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam("email") String email){
        try{
            return new ResponseEntity<>(authenticationService.sendForgotPasswordToken(email),
            HttpStatus.OK);
        } catch (EntityExistsException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.CONFLICT);
        } catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.NOT_FOUND);
        }
    }



    @GetMapping("/getAllEvents")
    public List<Event> getAllEvents(){
        return eventService.getAllEvents();
    }



    @PostMapping("/new-password")
    public ResponseEntity<?> newPassword(@RequestParam("token") String token, @RequestBody NewPasswordRequest newPasswordRequest){
      try{
          return ResponseEntity.ok(authenticationService.newPassword(token, newPasswordRequest.getNewPassword()));
      }catch (IllegalArgumentException e){
          return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.NOT_FOUND);
      }catch (Exception e){
          return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.BAD_REQUEST);
      }
    }


    @PostMapping("/verifyToken")
    public ResponseEntity<Boolean> verifyToken(@RequestParam("token") String token){
        return ResponseEntity.ok(passwordResetTokenService.verifyToken(token));
    }



    @PostMapping("/verifyPassword/{userId}/{password}")
    public ResponseEntity<?> verifyPassword(@PathVariable Long userId, @PathVariable String password) {
        try {
            boolean result = authenticationService.verifyPassword(userId, password);
            return ResponseEntity.ok(result);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }



    @GetMapping("/hello")
    @Operation(summary = "Say Hello", description = "This will say hello")
    public ResponseEntity<String> greet(){
        return new ResponseEntity<>("Hello World",HttpStatus.OK);
    }


    @Operation(summary = "Register A User with Send Link")
    @PostMapping("/registerLink")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest){
        try{
            return new ResponseEntity<>(authenticationService.generateConfirmationToken(registerRequest),HttpStatus.OK);
        }catch (EntityExistsException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.CONFLICT);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.BAD_REQUEST);
        }
    }




    /*

    @Operation(summary = "Confirm Account Creation")
    @GetMapping("/confirm/")
    public ResponseEntity<?> confirmRegister(@RequestParam("token") String token, HttpServletResponse response){
        try{
            boolean isConfirmed = authenticationService.confirmAccount(token);
            if(isConfirmed){
                response.sendRedirect("http://localhost:3000/Login");
            }
            return new ResponseEntity<>(isConfirmed,HttpStatus.OK);
        }catch (EntityNotFoundException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.CONFLICT);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.BAD_REQUEST);
        }
    }

     */





    @Operation(summary = "Confirm Account Creation")
    @GetMapping("/confirm/")
    public ResponseEntity<?> confirmRegister(@RequestParam("token") String token) {
        try {
            boolean isConfirmed = authenticationService.confirmAccount(token);
            if (isConfirmed) {
                // Return the confirmation HTML page
                String confirmationHtml = getConfirmationHtml();
                return ResponseEntity.ok()
                        .contentType(MediaType.TEXT_HTML)
                        .body(confirmationHtml);
            }
            return ResponseEntity.badRequest().body("Invalid or expired token");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String getConfirmationHtml() {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Confirmed</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f4f4f4;
                        text-align: center;
                    }
                    .container {
                        background-color: #ffffff;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        padding: 40px;
                    }
                    h1 {
                        color: #FDCC01;
                    }
                    #timer {
                        font-size: 24px;
                        font-weight: bold;
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Account Confirmed!</h1>
                    <p>Your account has been successfully confirmed. Thank you for joining EventEase!</p>
                    <p>You will be redirected to the login page in <span id="timer">5</span> seconds.</p>
                </div>

                <script>
                    let timeLeft = 5;
                    const timerElement = document.getElementById('timer');

                    function updateTimer() {
                        timerElement.textContent = timeLeft;
                        if (timeLeft === 0) {
                            window.location.href = 'http://localhost:3000/Login';
                        } else {
                            timeLeft--;
                            setTimeout(updateTimer, 1000);
                        }
                    }

                    updateTimer();
                </script>
            </body>
            </html>
        """;
    }






    @Operation(summary = "Register A User")
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest){
        try{
            LoginResponse loginResponse = authenticationService.registerUser(registerRequest);
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        }catch (EntityExistsException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.CONFLICT);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping("/test")
    public String greetings(){
        return "Welcome to the testing unit";
    }
    @Operation(summary = "Login With User Credentials")
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){
        try{

            LoginResponse loginResponse = authenticationService.loginUser(loginRequest);
            return new ResponseEntity<>(loginResponse,HttpStatus.OK);
        }catch (EntityNotFoundException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.CONFLICT);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.BAD_REQUEST);
        }
    }





    @Operation(summary = "Calls Db")
    @GetMapping("/callCron")
    public ResponseEntity<?> callCron(){
        try{
            return new ResponseEntity<>(authenticationService.callCron(),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.BAD_REQUEST);
        }
    }











}
