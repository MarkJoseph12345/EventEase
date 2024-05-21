package com.capstone.EventEase.Controller;


import com.capstone.EventEase.Service.UserEventService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth/userevent/")
public class UserEventController {



        private  final UserEventService userEventService;







        @PostMapping("/joinEvent/{userId}/{eventId}")
        public ResponseEntity<?> joinEvent(@PathVariable Long userId, @PathVariable Long eventId){
                try{
                    return new ResponseEntity<>(userEventService.joinEvent(userId,eventId),HttpStatus.OK);
                }catch (EntityNotFoundException e){
                    return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.CONFLICT);
                }
        }


        @GetMapping("/getAllEventsJoinedByUser/{userId}")
        public ResponseEntity<?> getAllEventsJoinedByUser(@PathVariable Long userId){
            try{
               return new ResponseEntity<>(userEventService.getAllEventsJoinedByUser(userId),HttpStatus.OK);
            }catch (EntityNotFoundException e){
                return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.CONFLICT);
            }catch (Exception e){
                return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.BAD_REQUEST);
            }
        }


    @GetMapping("/getAllUsersJoinedToEvent/{eventId}")
    public ResponseEntity<?> getAllUsersJoinedToEvent(@PathVariable Long eventId){
        try{
            return new ResponseEntity<>(userEventService.getAllUsersJoinedToEvent(eventId),HttpStatus.OK);
        }catch (EntityNotFoundException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.CONFLICT);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.BAD_REQUEST);
        }
    }

}
