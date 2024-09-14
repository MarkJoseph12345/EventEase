package com.capstone.EventEase.Repository;

import com.capstone.EventEase.Entity.PasswordResetToken;
import com.capstone.EventEase.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken,Long> {


    PasswordResetToken findByToken(String token);

    PasswordResetToken findByUser(User user);
}
