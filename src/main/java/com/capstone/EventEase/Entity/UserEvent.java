package com.capstone.EventEase.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_event")
public class UserEvent {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;



    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
}
