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






    public String checkAttendance(String IdNumber){

       User user = userRepository.findByIdNumber(IdNumber);
        if(user == null){
            throw new EntityNotFoundException("User not Found");
        }
        return "User attended";
    }
}
