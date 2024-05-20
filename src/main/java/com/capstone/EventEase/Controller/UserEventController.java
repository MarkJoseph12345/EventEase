package com.capstone.EventEase.Controller;


import com.capstone.EventEase.Service.UserEventService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
