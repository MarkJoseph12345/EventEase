package com.capstone.EventEase.Service;


import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {


    private final UserRepository userRepository;

    public String checkAttendance(String username){

        User user = userRepository.findByUsername(username);
        if(user == null){
            throw new EntityNotFoundException("Username dont Exists!");
        }
        return username + " attendance checked";
    }

    public User blockUser(Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User Not Found!"));
        user.setBlocked(true);
        userRepository.save(user);
        return user;
    }
    public User unBlockUser(Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User Not Found!"));
        user.setBlocked(false);
        userRepository.save(user);
        return user;
    }



}
