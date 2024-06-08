package com.capstone.EventEase.Controller;


import com.capstone.EventEase.Entity.Event;
import com.capstone.EventEase.Service.EventService;
import com.capstone.EventEase.Service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth/event")
public class EventController {







    private final EventService eventService;

    private final ImageService imageService;

    @PostMapping("createEvent")
    public ResponseEntity<?> createEvent(@RequestBody Event event){
      return new ResponseEntity(eventService.craeteEvent(event),HttpStatus.OK);
    }


    @PutMapping("updateEvent/{eventId}")
    public ResponseEntity<?> updateEvent(@PathVariable Long eventId,@RequestBody Event event){
        return new ResponseEntity(eventService.updateEvent(eventId,event),HttpStatus.OK);
    }



    @PutMapping("/updateEventPicture/{eventId}")
    public ResponseEntity<?> uploadEventPicture(@PathVariable Long eventId,@RequestParam("eventImage") MultipartFile file) throws IOException{
        return new ResponseEntity<>(imageService.uploadEventImage(eventId,file),HttpStatus.OK);
    }



    @GetMapping("getEventById/{eventId}")
    public ResponseEntity<?> getEvent(@PathVariable Long eventId) throws Exception{
        return new ResponseEntity<>(eventService.getEvent(eventId),HttpStatus.OK);
    }




    @GetMapping("/getEventPicture/{eventId}")
    public ResponseEntity<?> getEventPicture(@PathVariable Long eventId) throws IOException{

        String format = imageService.getEventPictureFormat(eventId);
        MediaType mediaType;
        switch (format){
            case "png":
                mediaType = MediaType.IMAGE_PNG;
                break;
            case "jpg":
                mediaType = MediaType.IMAGE_JPEG;
                break;
            case "svg":
                mediaType = MediaType.valueOf("image/svg+xml");
                break;
            default:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unsupported Format: " + format);
        }
        byte[] eventImage = imageService.downloadEventImage(eventId);
        return ResponseEntity.status(HttpStatus.OK).contentType(mediaType).body(eventImage);
    }






    @GetMapping("/getAllEvents")
    public List<Event> getAllEvents(){
        return eventService.getAllEvents();
    }




    @DeleteMapping("deleteEventById/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId) throws Exception {
        return new ResponseEntity<>(eventService.deleteEvent(eventId), HttpStatus.OK);
    }








}

