package com.capstone.EventEase.Controller;


import com.capstone.EventEase.DTO.Request.ForgotPasswordRequest;
import com.capstone.EventEase.DTO.Request.LoginRequest;
import com.capstone.EventEase.DTO.Request.NewPasswordRequest;
import com.capstone.EventEase.DTO.Request.RegisterRequest;
import com.capstone.EventEase.DTO.Response.LoginResponse;
import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Service.AuthenticationService;
import com.capstone.EventEase.Service.PasswordResetTokenService;
import com.capstone.EventEase.Service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/")
@RequiredArgsConstructor
@Tag(name = "AUTHENTICATION CONTROLLER", description = "THIS IS THE AUTHENTICATION CONTROLLER")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    private final PasswordResetTokenService passwordResetTokenService;





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




    @Operation(summary = "Update User By passing UserId and new User Credentials")
    @PutMapping("/updateUser/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId,@RequestBody
    User user) throws EntityExistsException{
        try{
            LoginResponse updatedUser = authenticationService.updateUser(userId,user);
            return new ResponseEntity<>(updatedUser,HttpStatus.CREATED);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.BAD_REQUEST);
        }
    }
























}
