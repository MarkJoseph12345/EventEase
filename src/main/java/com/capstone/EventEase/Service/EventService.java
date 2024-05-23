package com.capstone.EventEase.Service;

import com.capstone.EventEase.Entity.Event;
import com.capstone.EventEase.Repository.EventRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.plaf.multi.MultiTabbedPaneUI;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {


    private final EventRepository eventRepository;


    private final ImageService imageService;



    public Event craeteEvent(Event event){
        return eventRepository.save(event);
    }

    public Event getEvent(Long eventId){
        return eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event Dont Exists!"));
    }


    public String deleteEvent(Long eventId) throws IOException{
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event Dont Exists!"));
        if(event.getEventPicture() != null){
            imageService.deleteImage(event.getEventPicture());
        }
        eventRepository.deleteById(eventId);
        return "Event Has been Deleted";
    }




    public List<Event> getAllEvents(){
        return eventRepository.findAll();
    }




    public Event updateEvent(Long eventId,Event event){
       Event oldEvent = eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event not Found!"));

       if(oldEvent.getEventName() != null && !oldEvent.getEventName().isEmpty()){
           oldEvent.setEventName(event.getEventName());
       }
        if(oldEvent.getEventDescription() != null && !oldEvent.getEventDescription().isEmpty()){
            oldEvent.setEventDescription(event.getEventDescription());
        }
        if(oldEvent.getEventStarts() != null){
            oldEvent.setEventStarts(event.getEventStarts());
        }
        if(oldEvent.getEventEnds() != null){
            oldEvent.setEventEnds(event.getEventEnds());
        }

        if(oldEvent.getDepartment() != null && !oldEvent.getDepartment().isEmpty()){
            oldEvent.setDepartment(event.getDepartment());
        }
        if(oldEvent.getEventType() != null && !oldEvent.getEventType().isEmpty()){
            oldEvent.setEventType(event.getEventType());
        }

       return eventRepository.save(oldEvent);
    }


}