package com.capstone.EventEase.Repository;

import com.capstone.EventEase.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<User,Long> {

    User findByUsername(String username);


    // @Query("SELECT user FROM tbl_user WHERE user.id_number = ?1")
    @Query("SELECT usr FROM User usr WHERE usr.IdNumber = ?1")
    User findByIdNumber(String IdNumber);


    User findByProfilePictureName(String fileName);
}
