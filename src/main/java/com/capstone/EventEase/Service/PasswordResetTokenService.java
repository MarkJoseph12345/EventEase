package com.capstone.EventEase.Service;


import com.capstone.EventEase.Entity.PasswordResetToken;
import com.capstone.EventEase.Repository.PasswordResetTokenRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {

    private final PasswordResetTokenRepository resetTokenRepository;


    public boolean verifyToken(String token) {

       PasswordResetToken resetToken = resetTokenRepository.findByToken(token);
        if (resetToken == null) {
            throw new EntityNotFoundException("Token not found or has expired");
        }

        boolean isTokenExpired = resetToken.getExpiryDate().isBefore(LocalDateTime.now());

        if (isTokenExpired) {
            resetTokenRepository.delete(resetToken);
            throw new EntityNotFoundException("Token has expired");
        }

        return true;
    }

}
