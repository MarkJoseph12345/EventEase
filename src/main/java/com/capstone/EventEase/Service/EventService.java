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
import org.springframework.web.multipart.MultipartFile;

import javax.swing.plaf.multi.MultiTabbedPaneUI;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    private final UserEventRepository userEventRepository;

    private final UserRepository userRepository;


    private final ImageService imageService;

    public Event craeteEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event getEvent(Long eventId) {
        return eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event Dont Exists!"));
    }

    public String deleteEvent(Long eventId) throws IOException {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event Dont Exists!"));
        List<UserEvent> userEvents = userEventRepository.findByEventId(eventId);
        for (UserEvent userEvent : userEvents) {
            userEventRepository.delete(userEvent);
        }
        eventRepository.deleteById(eventId);
        return "Event Has been Deleted";
    }




    public Event getByEventStarts(OffsetDateTime date){
        Event event = eventRepository.findByEventStarts(date);
        if(event == null){
            throw new EntityNotFoundException("Event with that date Not Found!");
        }
        return event;
    }


    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event updateEvent(Long eventId, Event event) {
        Event oldEvent = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not Found!"));

        if (oldEvent.getEventName() != null && !oldEvent.getEventName().isEmpty()) {
            oldEvent.setEventName(event.getEventName());
        }
        if (oldEvent.getEventDescription() != null && !oldEvent.getEventDescription().isEmpty()) {
            oldEvent.setEventDescription(event.getEventDescription());
        }
        if (oldEvent.getEventStarts() != null) {
            oldEvent.setEventStarts(event.getEventStarts());
        }
        if (oldEvent.getEventEnds() != null) {
            oldEvent.setEventEnds(event.getEventEnds());
        }

        if (oldEvent.getDepartment() != null && !oldEvent.getDepartment().isEmpty()) {
            oldEvent.setDepartment(event.getDepartment());
        }
        if (oldEvent.getEventType() != null && !oldEvent.getEventType().isEmpty()) {
            oldEvent.setEventType(event.getEventType());
        }

        return eventRepository.save(oldEvent);
    }



    public OffsetDateTime getEventStarts(Long eventId){
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event not found"));
        return event.getEventStarts();
    }


    public Event likeEvent(Long eventId, Long userId){
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event not Found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not Found"));

        if(event.getUsersLiked().contains(user.getUsername())){
                throw new RuntimeException("User already Liked");
        }else{
            event.setLikes(event.getLikes()+1);
            event.getUsersLiked().add(user.getUsername());
            if(event.getUsersDisliked().contains(user.getUsername())){
                event.setDislikes(event.getDislikes()-1);
                event.getUsersDisliked().remove(user.getUsername());
            }

            eventRepository.save(event);
        }

       return event;
    }

    public Event dislikeEvent(Long eventId, Long userId){
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event not Found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not Found"));


        if(event.getUsersDisliked().contains(user.getUsername())){
            throw new RuntimeException("User already DisLiked");
        }else{
            event.setDislikes(event.getDislikes()+1);
            event.getUsersDisliked().add(user.getUsername());

            if(event.getUsersLiked().contains(user.getUsername())){
                event.setLikes(event.getLikes()-1);
                event.getUsersLiked().remove(user.getUsername());
            }

            eventRepository.save(event);
        }

        return event;
    }





}
