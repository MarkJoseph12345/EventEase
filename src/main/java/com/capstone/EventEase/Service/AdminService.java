package com.capstone.EventEase.Service;


import com.capstone.EventEase.ENUMS.Role;
import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService {


    private final UserRepository userRepository;

    private final EmailService emailService;

    public String checkAttendance(String username){

        User user = userRepository.findByUsername(username);
        if(user == null){
            throw new EntityNotFoundException("Username does not Exists!");
        }
        return username + " attendance checked";
    }



    public User getUserById(Long userId){
        return userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User Not Found!"));
    }

    public User blockUser(Long userId){
        User user = getUserById(userId);
        user.setBlocked(true);
        emailService.sendBlockEmail(user.getUsername());
        userRepository.save(user);

        return user;
    }

    public User unblockUser(Long userId){
        User user = getUserById(userId);
        user.setBlocked(false);
        emailService.sendUnblockEmail(user.getUsername());
        userRepository.save(user);

        return user;
    }




    public User setAdmin(Long userId){
        User user = getUserById(userId);
        user.setRole(Role.ADMIN);
        userRepository.save(user);
        return user;
    }

    public User setStudent(Long userId){
        User user = getUserById(userId);
            user.setRole(Role.STUDENT);
        userRepository.save(user);
        return user;
    }






}
