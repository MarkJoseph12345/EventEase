package com.capstone.EventEase.Service;


import com.capstone.EventEase.Classes.EventPopularityMetrics;
import com.capstone.EventEase.Entity.Event;
import com.capstone.EventEase.Repository.EventRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventAnalyticsService {



    private final EventRepository repository;




    public Event getEventById(Long eventId) {
        return repository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event Not Found!"));
     }

    public EventPopularityMetrics calculateEventPopularity(Long eventId){
        Event event = getEventById(eventId);
        EventPopularityMetrics metrics = new EventPopularityMetrics();
        final int NO_DISLIKES = 0;
        metrics.totalLikes = event.getLikes();
        metrics.totalDislikes = event.getDislikes();
        metrics.likesDislikesRatio = (event.getDislikes() == NO_DISLIKES) ? event.getLikes():
                (double) event.getLikes() / event.getDislikes();
        return metrics;
    }



    public double calculateJoinRate(Long eventId){
        Event event = getEventById(eventId);
        final int N0_LIMIT = 0;
       return (event.getEventLimit() == N0_LIMIT) ? 0:(double) event.getUsersJoined() / event.getEventLimit();
    }



    public List<Event> getAllEvents() {
        return repository.findAll();
    }

    public  Map<String, Long> analyzeEventTypeDistribution() {
        return getAllEvents().stream()
                .collect(Collectors.groupingBy(Event::getEventType, Collectors.counting()));
    }

    public  Map<OffsetDateTime, Long> analyzeEventSchedulingTrends() {
        return getAllEvents().stream()
                .collect(Collectors.groupingBy(Event::getEventStarts, Collectors.counting()));
    }

    public double calculateAverageEventDuration() {
        return getAllEvents().stream()
                .mapToLong(event ->
                        event.getEventEnds().toEpochSecond() - event.getEventStarts().toEpochSecond())
                .average()
                .orElse(0);
    }


    public  Map<String, Double> analyzeDepartmentEngagement() {
        List<Event> events = getAllEvents();
        Map<String, Long> departmentCounts = events.stream()
                .flatMap(event -> event.getDepartment().stream())
                .collect(Collectors.groupingBy(dept -> dept, Collectors.counting()));
        long totalEvents = events.size();
        return departmentCounts.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> (double) entry.getValue() / totalEvents
                ));
    }


}

