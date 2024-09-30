package com.capstone.EventEase.Controller;


import com.capstone.EventEase.Service.EventAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@Tag(name = "ANALYTICS CONTROLLER", description = "THIS IS THE ANALYTICS CONTROLLER")
public class AnalyticsController {


    private final EventAnalyticsService service;




    @Operation(summary = "Get Event Popularity")
    @GetMapping("/getEventPopularity/")
    public ResponseEntity<?> getEventPopularity(@RequestParam("eventId") Long eventId){
        try{
            return new ResponseEntity<>(service.calculateEventPopularity(eventId),HttpStatus.OK);
        }catch (EntityNotFoundException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.NOT_FOUND);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }




    @Operation(summary = "Get Join Rate for Event")
    @GetMapping("/getJoinRate/")
    public ResponseEntity<?> getJoinRate(@RequestParam("eventId") Long eventId){
        try{
            return new ResponseEntity<>(service.calculateJoinRate(eventId),HttpStatus.OK);
        }catch (EntityNotFoundException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.NOT_FOUND);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }


    @Operation(summary = "Get Event Type Distribution")
    @GetMapping("/getEventTypeDistribution")
    public ResponseEntity<?> getEventDistribution(){
        try{
            return new ResponseEntity<>(service.analyzeEventTypeDistribution(),HttpStatus.OK);
        }catch (EntityNotFoundException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.NOT_FOUND);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }


    @Operation(summary = "Get Event Scheduling Trends")
    @GetMapping("/getEventSchedulingTrends")
    public ResponseEntity<?> getEventSchedulingTrends(){
        try{
            return new ResponseEntity<>(service.analyzeEventSchedulingTrends(),HttpStatus.OK);
        }catch (EntityNotFoundException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.NOT_FOUND);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }


    @Operation(summary = "Get Average Event Duration")
    @GetMapping("/getAverageEventDuration")
    public ResponseEntity<?> getAverageEventDuration(){
        try{
            return new ResponseEntity<>(service.calculateAverageEventDuration(),HttpStatus.OK);
        }catch (EntityNotFoundException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.NOT_FOUND);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }


    @Operation(summary = "Get Department Engagement")
    @GetMapping("/getDepartmentEngagement")
    public ResponseEntity<?> getDepartmentEngagement(){
        try{
            return new ResponseEntity<>(service.analyzeDepartmentEngagement(),HttpStatus.OK);
        }catch (EntityNotFoundException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.NOT_FOUND);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }




}
