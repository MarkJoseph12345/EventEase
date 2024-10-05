package com.capstone.EventEase.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tbl_password")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "passtoken_id")
    private Long id;


    private String token;
    @OneToOne
    @JoinColumn(name = "user_id",referencedColumnName = "user_id")
    private User user;


    private LocalDateTime expiryDate;



    public PasswordResetToken(String randomToken, User user) {
        this.token = randomToken;
        this.user = user;
        this.expiryDate = LocalDateTime.now().plusMinutes(30);
    }
}
