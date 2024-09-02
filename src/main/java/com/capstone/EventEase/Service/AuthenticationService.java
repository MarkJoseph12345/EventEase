package com.capstone.EventEase.Service;


import com.capstone.EventEase.DTO.Request.LoginRequest;
import com.capstone.EventEase.DTO.Request.RegisterRequest;
import com.capstone.EventEase.DTO.Response.LoginResponse;
import com.capstone.EventEase.ENUMS.Gender;
import com.capstone.EventEase.ENUMS.Role;
import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Repository.UserRepository;
import com.capstone.EventEase.UTIL.ImageUtils;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor

public class AuthenticationService {


    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;



    private  final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final ImageUtils imageUtils;



    private byte[] getDefaultProfilePicture (){

        try{

            Path path = Paths.get(new ClassPathResource("static/images/profile.png").getURI());
            return Files.readAllBytes(path);
        }catch (IOException e){
            System.out.println("Error: " + e.getMessage());
            return new byte[0];
        }
    }



    public LoginResponse registerUser(RegisterRequest registerRequest){
        if(userRepository.findByUsername(registerRequest.getUsername()) != null) {
            throw new EntityExistsException("Username Already Exists!");
        }


        User newUser = User.builder().username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.STUDENT)
                .firstName(registerRequest.getFirstName()).lastName(registerRequest.getLastName())
                .IdNumber(registerRequest.getIdNumber()).department(registerRequest.getDepartment())
                .isBlocked(false).gender(Gender.valueOf(registerRequest.getGender().toString()))
               .profilePicture(ImageUtils.compressImage(getDefaultProfilePicture()))
                .profilePictureName("profile.png")
                .profilePictureType("image/png")
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
