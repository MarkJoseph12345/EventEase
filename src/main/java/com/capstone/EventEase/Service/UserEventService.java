package com.capstone.EventEase.Service;


import com.capstone.EventEase.Entity.Event;
import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Entity.UserEvent;
import com.capstone.EventEase.Repository.EventRepository;
import com.capstone.EventEase.Repository.UserEventRepository;
import com.capstone.EventEase.Repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class UserEventService {


    private final UserEventRepository repository;


    private final UserRepository userRepository;

    private final EventRepository eventRepository;

    public UserEvent joinEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User Dont Exists"));
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event Dont Exists"));
        UserEvent userEvent = new UserEvent();
        userEvent.setUser(user);
        userEvent.setEvent(event);
        repository.save(userEvent);
        return userEvent;
    }

    public List<UserEvent> getAllEventsJoinedByAllUsers(){
            return repository.findAll();
    }








    public List<Event> getAllEventsJoinedByUser(Long userId) {
       return repository.findAll().stream().filter(userEvent -> userEvent.getUser().getId().equals(userId))
                .map(UserEvent::getEvent)
                .collect(Collectors.toList());
    }

    public List<User> getAllUsersJoinedToEvent(Long eventId) {
        return repository.findAll().stream()
                .filter(userEvent -> userEvent.getEvent().getId().equals(eventId))
                .map(UserEvent::getUser)
                .collect(Collectors.toList());
    }








}
