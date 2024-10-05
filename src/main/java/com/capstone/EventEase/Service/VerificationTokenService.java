package com.capstone.EventEase.Service;


import com.capstone.EventEase.Entity.VerificationToken;
import com.capstone.EventEase.Repository.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VerificationTokenService {


    private final VerificationTokenRepository verificationTokenRepository;

    public boolean isVerificationTokenExpired(String token){
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token);
        return verificationToken.getExpiryDate().isBefore(LocalDateTime.now());
    }
}
