package com.capstone.EventEase.Service;


import com.capstone.EventEase.DTO.Request.LoginRequest;
import com.capstone.EventEase.DTO.Request.RegisterRequest;
import com.capstone.EventEase.DTO.Response.LoginResponse;
import com.capstone.EventEase.ENUMS.Gender;
import com.capstone.EventEase.ENUMS.Role;
import com.capstone.EventEase.Entity.PasswordResetToken;
import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Entity.VerificationToken;
import com.capstone.EventEase.Exceptions.AccountNotEnabledException;
import com.capstone.EventEase.Repository.PasswordResetTokenRepository;
import com.capstone.EventEase.Repository.UserRepository;
import com.capstone.EventEase.Repository.VerificationTokenRepository;
import com.capstone.EventEase.UTIL.ImageUtils;
import jakarta.mail.MessagingException;
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
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class AuthenticationService {


    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;



    private  final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;



    private final EmailService emailService;

    private final PasswordResetTokenRepository passwordResetTokenRepository;


    private final VerificationTokenRepository verificationTokenRepository;



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
                .uuid(UUID.randomUUID().toString())
                .firstName(registerRequest.getFirstName()).lastName(registerRequest.getLastName())
                .IdNumber(registerRequest.getIdNumber()).department(registerRequest.getDepartment())
                .isBlocked(false).gender(Gender.valueOf(registerRequest.getGender().toString()))
                .isVerified(false)
               .profilePicture(ImageUtils.compressImage(getDefaultProfilePicture()))
                .profilePictureName("XyloGraph1.png")
                .profilePictureType("image/png")
                .build();


        User user = userRepository.save(newUser);

        return new LoginResponse(user, jwtService.generateToken(user));
    }


    public String generateConfirmationToken(RegisterRequest registerRequest) throws MessagingException {

        if(userRepository.findByUsername(registerRequest.getUsername()) != null) {
            throw new EntityExistsException("Username Already Exists!");
        }



        User newUser = User.builder().username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.STUDENT)
                .uuid(UUID.randomUUID().toString())
                .firstName(registerRequest.getFirstName()).lastName(registerRequest.getLastName())
                .IdNumber(registerRequest.getIdNumber()).department(registerRequest.getDepartment())
                .isBlocked(false).gender(Gender.valueOf(registerRequest.getGender().toString()))
                .isVerified(false)
                .profilePicture(ImageUtils.compressImage(getDefaultProfilePicture()))
                .profilePictureName("XyloGraph1.png")
                .profilePictureType("image/png")
                .build();

        User user = userRepository.save(newUser);

        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(token,user);
        verificationTokenRepository.save(verificationToken);
        emailService.sendConfirmationLink(user.getUsername(),token);
        return "Check your email for verification";
    }



    public boolean confirmAccount(String token){
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token);
        if(token == null){
            throw new EntityNotFoundException("Token Not Found!");
        }
        User user = verificationToken.getUser();
        user.setVerified(true);
        userRepository.save(user);
       verificationTokenRepository.delete(verificationToken);
        return true;
    }






    public LoginResponse loginUser(LoginRequest loginRequest) throws AccountNotEnabledException {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if(user == null){
            throw new EntityNotFoundException("User not Found!");
        }
        if(!user.isVerified()){
            throw new AccountNotEnabledException("Account Has Not Been Verified");
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




    public String sendForgotPasswordToken(String email) throws MessagingException {
        User user = userRepository.findByUsername(email);
        if(user == null){
            throw new EntityNotFoundException("User with that email not Found!");
        }

        PasswordResetToken existingUser = passwordResetTokenRepository.findByUser(user);

        if(existingUser != null){
            throw new EntityExistsException("Token Already Sent");
        }

        String token = UUID.randomUUID().toString().replaceAll("[^0-9]","");
        String randomToken = token.substring(0,6);

        PasswordResetToken passwordResetToken = new PasswordResetToken(randomToken,user);


        passwordResetTokenRepository.save(passwordResetToken);

        emailService.forgotPasswordEmail(email,randomToken);
        return "Email has been send!";
    }


    public String newPassword(String token, String newPassword){
            PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token);
            if(passwordResetToken == null){
                throw new EntityNotFoundException("Invalid Token");
            }
            if(passwordResetToken.getExpiryDate().isBefore(LocalDateTime.now())){
                passwordResetTokenRepository.delete(passwordResetToken);
                throw new IllegalArgumentException("Token has expired!");
            }
            User user =  passwordResetToken.getUser();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            passwordResetTokenRepository.delete(passwordResetToken);
            return "New Password Updated";
    }






    public boolean verifyPassword(Long userId, String oldPassword){
        Optional<User> user = userRepository.findById(userId);
        return user.map(value -> passwordEncoder.matches(oldPassword, value.getPassword())).orElse(false);
    }







}
