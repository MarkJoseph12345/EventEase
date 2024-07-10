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

import java.util.List;
import java.util.Optional;
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



    public UserEvent unjoinEvent(Long userId, Long eventId){
      /*
      Two Solutions But Solution 2 is faster and more readable
        Optional<UserEvent> userEventOptional = repository.findAll().stream().filter(userEvent ->
                userEvent.getEvent().getId().equals(eventId) && userEvent.getUser().getId().equals(userId))
                .findFirst();

        Long userEventId = userEventOptional.map(UserEvent::getId)
                .orElseThrow(() -> new EntityNotFoundException("NO USER OR EVENT ASSOCIATED"));
        Optional<UserEvent> userEvent = repository.findById(userEventId);

        repository.deleteById(userEventId);
       return userEvent;

       */

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + userId + " not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event with id " + eventId + " not found"));

        UserEvent userEvent = repository.findByUserAndEvent(user, event);

        if (userEvent == null) {
            throw new EntityNotFoundException("No UserEvent associated with user " + userId + " and event " + eventId);
        }

        repository.deleteById(userEvent.getId());
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
