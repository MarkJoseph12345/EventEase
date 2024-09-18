package com.capstone.EventEase.Repository;

import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken,Long> {


    VerificationToken findByUser(User user);
    VerificationToken findByToken(String token);
}
