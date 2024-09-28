package com.capstone.EventEase.UserServiceTest;

import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Repository.UserRepository;
import com.capstone.EventEase.Service.UserService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Transactional
public class UserServiceIntegrationTest {


    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveUserAndGetUserByUsername(){
            User user = new User();
            user.setUsername("testUser");
            userService.saveUser(user);

            User fetchedUser = userService.getUserByUsername("testUser");
            assertNotNull(fetchedUser);
            assertEquals("testUser",fetchedUser.getUsername());
    }
}


