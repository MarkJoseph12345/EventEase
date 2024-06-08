package com.capstone.EventEase.Controller;


import com.capstone.EventEase.DTO.Request.LoginRequest;
import com.capstone.EventEase.DTO.Request.RegisterRequest;
import com.capstone.EventEase.DTO.Response.LoginResponse;
import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/")
@RequiredArgsConstructor
@Tag(name = "Authentication Controller", description = "Authentication Controller mwheheh")
public class AuthenticationController {

    private final AuthenticationService authenticationService;






    @GetMapping("/hello")
    @Operation(summary = "Say Hello", description = "This will say hello")
    public ResponseEntity<String> greet(){
        return new ResponseEntity<>("Hello World",HttpStatus.OK);
    }



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




    @PutMapping("/updateUser/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId,@RequestBody
    User user){
        try{
            LoginResponse updatedUser = authenticationService.updateUser(userId,user);
            return new ResponseEntity<>(updatedUser,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.BAD_REQUEST);
        }
    }
























}
