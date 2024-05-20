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

@Service
@RequiredArgsConstructor

public class UserEventService {


    private final UserEventRepository repository;


    private final UserRepository userRepository;

    private final EventRepository eventRepository;

    public UserEvent joinEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId).get();
        Event event = eventRepository.findById(eventId).get();

        if (user == null && event == null) {
            throw new EntityNotFoundException("One of the Entities Dont Exists!");
        }
        UserEvent userEvent = new UserEvent();
        userEvent.setUser(user);
        userEvent.setEvent(event);
        repository.save(userEvent);

        return userEvent;

    }
}
