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
import java.util.Random;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class StartUp{



    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    private byte[] getDefaultProfilePicture (){

        try{

            Path path = Paths.get(new ClassPathResource("static/images/lyza.jpg").getURI());
            return Files.readAllBytes(path);
        }catch (IOException e){
            System.out.println("Error: " + e.getMessage());
            return new byte[0];
        }
    }


    

    @PostConstruct
    public void init() {
        if (userRepository.findByUsername("admin") == null) {
            User newUser = User.builder().username("admin")
                    .password(passwordEncoder.encode("admin"))
                    .role(Role.ADMIN)
                    .uuid(UUID.randomUUID().toString())
                    .firstName("ADMIN").lastName("ADMIN")
                    .IdNumber("21-9999-999").department("ADMIN")
                    .isBlocked(false)
                    .isVerified(true)
                    .profilePicture(ImageUtils.compressImage(getDefaultProfilePicture()))
                    .profilePictureName("admin.png")
                    .profilePictureType("image/png")
                    .build();
            userRepository.save(newUser);
        }



        /*
        String[] departments = {"CEA", "CMBA", "CASE", "CNAHS", "CCS", "CCJ"};
        String[] firstNames = {"Alice", "Bob", "Charlie", "Diana", "Emma", "Frank", "Grace", "Henry", "Isla", "Jack"};
        String[] lastNames = {"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"};

        Random random = new Random();

        for (int i = 0; i < 100; i++) {
            String firstName = firstNames[random.nextInt(firstNames.length)];
            String lastName = lastNames[random.nextInt(lastNames.length)];
            String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + random.nextInt(1000);
            String gender = random.nextBoolean() ? "MALE" : "FEMALE";
            String idNumber = String.format("%02d-%04d-%03d",
                    random.nextInt(100), random.nextInt(10000), random.nextInt(1000));
            String department = departments[random.nextInt(departments.length)];

            User user = User.builder()
                    .firstName(firstName)
                    .lastName(lastName)
                    .username(email)
                    .uuid(UUID.randomUUID().toString())
                    .IdNumber(idNumber)
                    .password(passwordEncoder.encode("password"))
                    .department(department)
                    .gender(Gender.valueOf(gender))
                    .isBlocked(false)
                    .isVerified(true)
                    .role(Role.STUDENT)
                    .build();
            userRepository.save(user);
        }

         */



    }
}
