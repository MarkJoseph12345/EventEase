package com.capstone.EventEase.Service;

import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Entity.UserEvent;
import com.capstone.EventEase.Exceptions.EntityNotDeletedException;
import com.capstone.EventEase.Repository.UserEventRepository;
import com.capstone.EventEase.Repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;


@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {



    private final UserRepository userRepository;

    private final UserEventRepository userEventRepository;

    private final ImageService imageService;



    public void saveUser(User user){
        userRepository.save(user);
    }



    public List<User> getAllUsers(){
        return userRepository.findAll();
    }


    public User getUserByUsername(String username){
        User user = userRepository.findByUsername(username);

        if(user == null){
            throw new EntityNotFoundException("User not Found hehe");
        }else{
            return user;
        }
    }

    public User getUserById(Long id){
        return userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User Does not Exists!"));
    }

    public String deleteUserById(Long userId) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not Found!"));
        List<UserEvent> userEvents = userEventRepository.findByUserId(userId);
        for(UserEvent userEvent: userEvents){
            userEventRepository.delete(userEvent);
        }
        userRepository.deleteById(userId);
        return "User has been Deleted";
    }

    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return getUserByUsername(username);
    }
}


