package com.capstone.EventEase.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_event")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEvent {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userevent_id")
    private Long id;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;



    @ManyToOne
    @JoinColumn(name = "event_id")

    private Event event;
}
