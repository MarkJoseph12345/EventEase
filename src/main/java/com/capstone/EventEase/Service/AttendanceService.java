package com.capstone.EventEase.Service;


import com.capstone.EventEase.Entity.*;
import com.capstone.EventEase.Repository.AttendanceRepository;
import com.capstone.EventEase.Repository.EventRepository;
import com.capstone.EventEase.Repository.UserEventRepository;
import com.capstone.EventEase.Repository.UserRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;


    private final UserRepository userRepository;

    private final EventRepository eventRepository;

    private final UserEventRepository repository;


    public Attendance checkAttendance(Long eventId, String username, OffsetDateTime attendanceDate){

        User user = userRepository.findByUsername(username);
        if(user == null){
            throw new EntityNotFoundException("User not Found!");
        }
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event with id " + eventId + " not found"));
        UserEvent userEvent = repository.findByUserAndEvent(user,event);
        if(userEvent == null){
            throw new EntityNotFoundException("User Event Not Found!");
        }

        Optional<Attendance> attendanceCheck = attendanceRepository.findByUserevent(userEvent);

        if(attendanceCheck.isPresent()){
            throw new EntityExistsException("Attendance Already Checked");
        }



        Attendance attendance = new Attendance();
        attendance.setUserevent(userEvent);
        attendance.setAttendedTime(attendanceDate);
        return attendanceRepository.save(attendance);
    }


    private long getNumberofAttendance(Long userId, List<Attendance> allAttendances) {
        return allAttendances.stream()
                .filter(attendance -> attendance.getUserevent().getUser().getId().equals(userId))
                .count();
    }

    private long getNumberOfAttendanceInEvent(Long eventId, List<Attendance> attendances){
        return attendances.stream().filter(attendance -> attendance.getUserevent().getEvent().getId().equals(eventId))
                .count();
    }




    public List<EventAttendance> getAttendanceOfUsersInAllEvents(){
        List <Attendance> attendances = attendanceRepository.findAll();

        List<Event> events = attendances.stream().map(attendance -> attendance.getUserevent()
                .getEvent()).distinct().collect(Collectors.toList());

        List<EventAttendance> eventAttendances = events.stream().map(
                event -> new EventAttendance(event,getNumberOfAttendanceInEvent(event.getId(),attendances))).
                collect(Collectors.toList());

        return eventAttendances;
    }


    public List<UserAttendance> getTopThreeUsersByAttendance(){

        List<Attendance> allAttendances = attendanceRepository.findAll();

        List<User> users = allAttendances.stream().map(attendance -> attendance.getUserevent().getUser())
                .distinct().collect(Collectors.toList());

        List<UserAttendance> userAttendances = users.stream().map(user ->
                new UserAttendance(user,getNumberofAttendance(user.getId(),allAttendances))).collect(Collectors.toList());;


        return userAttendances.stream().sorted((user1,user2) -> Long.compare(user2.getAttendanceCount(),user1.getAttendanceCount()))
                .limit(3).collect(Collectors.toList());
    }










}

