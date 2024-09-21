package com.capstone.EventEase.Service;


import com.capstone.EventEase.ENUMS.AllowedGender;
import com.capstone.EventEase.ENUMS.Gender;
import com.capstone.EventEase.Entity.Event;
import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Entity.UserEvent;
import com.capstone.EventEase.Exceptions.DoubleJoinException;
import com.capstone.EventEase.Exceptions.EventFullException;
import com.capstone.EventEase.Exceptions.GenderNotAllowedException;
import com.capstone.EventEase.Exceptions.UserBlockedException;
import com.capstone.EventEase.Repository.EventRepository;
import com.capstone.EventEase.Repository.UserEventRepository;
import com.capstone.EventEase.Repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DateTimeException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class UserEventService {


    private final UserEventRepository repository;

    private final UserRepository userRepository;

    private final EventRepository eventRepository;

    private static final ZoneId UTC_8 = ZoneId.of("Asia/Singapore");






    public UserEvent joinEvent(Long userId, Long eventId) throws EventFullException, UserBlockedException, DoubleJoinException, GenderNotAllowedException, EntityNotFoundException {
        User user = getUserById(userId);
        Event event = getEventById(eventId);
        validateEventTiming(event);
        validateUserAndEvent(user, event);
        return processUserEventJoin(user, event);
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + userId + " not found"));
    }

    private Event getEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event with id " + eventId + " not found"));
    }

    private UserEvent getByUserAndEvent(User user, Event event) {
        return repository.findByUserAndEvent(user, event);
    }




    private void validateEventTiming(Event event) {
        ZonedDateTime currentDate = ZonedDateTime.now(UTC_8);
        ZonedDateTime eventStart = event.getEventStarts().atZoneSameInstant(UTC_8);
        ZonedDateTime eventEnd = event.getEventEnds().atZoneSameInstant(UTC_8);
        ZonedDateTime updatedStart = eventStart.plusMinutes(15);

        if (!currentDate.isBefore(updatedStart)) {
            throw new DateTimeException("Can't Join While Event is Happening");
        }
        if (currentDate.isAfter(eventEnd)) {
            throw new DateTimeException("Can't Join Because Event Already Ended");
        }
    }

    private void validateUserAndEvent(User user, Event event) throws UserBlockedException, DoubleJoinException, GenderNotAllowedException {
        UserEvent userAndEvent = getByUserAndEvent(user, event);
        String allowedGender = event.getAllowedGender().toString();
        String userGender = user.getGender().toString();

        if (allowedGender.equals("ALL")) {
            if (user.isBlocked()) {
                throw new UserBlockedException("User is currently Blocked and cannot join an event");
            }
            if (userAndEvent != null) {
                throw new DoubleJoinException("User Already Joined");
            }
        } else if (!allowedGender.equals(userGender)) {
            throw new GenderNotAllowedException("User with the gender is not allowed in this event");
        }
    }

    private UserEvent processUserEventJoin(User user, Event event) throws EventFullException {
        if (event.getUsersJoined() < event.getEventLimit()) {
            UserEvent userEvent = new UserEvent();
            userEvent.setUser(user);
            userEvent.setEvent(event);
            repository.save(userEvent);
            event.setUsersJoined(event.getUsersJoined() + 1);
            eventRepository.save(event);
            return userEvent;
        } else {
            throw new EventFullException("Event is Currently Full");
        }
    }





    public UserEvent unjoinEvent(Long userId, Long eventId) {

        User user = getUserById(userId);
        Event event = getEventById(eventId);


        UserEvent userEvent = getByUserAndEvent(user,event);

        if (userEvent == null) {
            throw new EntityNotFoundException("No UserEvent associated with user " + userId + " and event " + eventId);
        }

        event.setUsersJoined(event.getUsersJoined() - 1);
        eventRepository.save(event);

        repository.deleteById(userEvent.getId());
        return userEvent;
    }

    public List<UserEvent> getAllEventsJoinedByAllUsers() {
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
