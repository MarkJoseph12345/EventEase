package com.capstone.EventEase.Service;


import com.capstone.EventEase.DTO.Request.LoginRequest;
import com.capstone.EventEase.DTO.Request.RegisterRequest;
import com.capstone.EventEase.DTO.Response.LoginResponse;
import com.capstone.EventEase.Entity.Role;
import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Repository.UserRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.io.IOException;

@Service
@RequiredArgsConstructor

public class AuthenticationService {


    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;



    private  final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;


    public LoginResponse registerUser(RegisterRequest registerRequest){
        if(userRepository.findByUsername(registerRequest.getUsername()) != null){
            throw new EntityExistsException("Username Already Exists!");
        }

        User newUser = User.builder().username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.STUDENT)
                .firstName(registerRequest.getFirstName()).lastName(registerRequest.getLastName())
                .IdNumber(registerRequest.getIdNumber()).department(registerRequest.getDepartment())
                .build();




        User user = userRepository.save(newUser);
        return new LoginResponse(user, jwtService.generateToken(user));
    }






    
    public LoginResponse loginUser(LoginRequest loginRequest){
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if(user == null){
            throw new EntityNotFoundException("User not Found!");
        }

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),loginRequest.getPassword()
        ));

        return new LoginResponse(user,jwtService.generateToken(user));
    }




    public LoginResponse updateUser(Long userId, User user) throws IOException{
        User userPerson = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException(
                "User with id: " + userId + " not found!"
        ));







        if( user.getFirstName() != null &&  !user.getFirstName().isEmpty()){
            userPerson.setFirstName(user.getFirstName());
        }
        if( user.getLastName() != null &&  !user.getLastName().isEmpty()){
            userPerson.setLastName(user.getLastName());
        }

        if(user.getPassword() != null &&  !user.getPassword().isBlank()){
            userPerson.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return new LoginResponse(userRepository.save(userPerson), jwtService.generateToken(userPerson));
    }












}
