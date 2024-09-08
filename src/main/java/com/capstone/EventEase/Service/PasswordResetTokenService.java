package com.capstone.EventEase.Service;


import com.capstone.EventEase.Entity.PasswordResetToken;
import com.capstone.EventEase.Repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {

    private final PasswordResetTokenRepository resetTokenRepository;



    public boolean verifyToken(String token){
        return resetTokenRepository.findByToken(token) != null;
    }
}
