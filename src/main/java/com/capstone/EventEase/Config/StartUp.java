package com.capstone.EventEase.Config;


import com.capstone.EventEase.ENUMS.Gender;
import com.capstone.EventEase.ENUMS.Role;
import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Repository.UserRepository;
import com.capstone.EventEase.UTIL.ImageUtils;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class StartUp{



    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    private byte[] getDefaultProfilePicture (){

        try{

            Path path = Paths.get(new ClassPathResource("static/images/profile.png").getURI());
            return Files.readAllBytes(path);
        }catch (IOException e){
            System.out.println("Error: " + e.getMessage());
            return new byte[0];
        }
    }

    @PostConstruct
    public void init(){

        if(userRepository.findByUsername("admin") == null){
            User newUser = User.builder().username("admin")
                    .password(passwordEncoder.encode("admin"))
                    .role(Role.ADMIN)
                    .uuid(UUID.randomUUID().toString())
                    .firstName("ADMIN").lastName("ADMIN")
                    .IdNumber("21-9999-999").department("ADMIN")
                    .isBlocked(false)
                    .profilePicture(ImageUtils.compressImage(getDefaultProfilePicture()))
                    .profilePictureName("XyloGraph1.png")
                    .profilePictureType("image/png")
                    .build();
            userRepository.save(newUser);
        }


    }
}
