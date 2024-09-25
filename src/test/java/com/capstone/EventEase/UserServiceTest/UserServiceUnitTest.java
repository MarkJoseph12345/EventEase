package com.capstone.EventEase.UserServiceTest;


import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Repository.UserRepository;
import com.capstone.EventEase.Service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

public class UserServiceUnitTest {


    @Mock
    private UserRepository userRepository;


    @InjectMocks
    private UserService userService;


    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void testSaveUserAndGetUserByUsername(){
        User user = new User();
        user.setUsername("testUser");

        when(userRepository.save(user)).thenReturn(user);
        when(userRepository.findByUsername("testUser")).thenReturn(user);

        userService.saveUser(user);

        User fetchedUser = userService.getUserByUsername("testUser");

        assertNotNull(fetchedUser);

        assertEquals("testUser", fetchedUser.getUsername());
        verify(userRepository, times(1)).save(user);
    }



/*
    @Test
    void testGetUserById(){
        User user = new User();

        user.setId(1L);
        user.setUsername("testUser");

        when(userRepository.save(user)).thenReturn(user);
        when(userService.getUserById(1L)).thenReturn(user);


        userService.saveUser(user);

        User fetchedUser = userService.getUserById(1L);

    }



 */


}
