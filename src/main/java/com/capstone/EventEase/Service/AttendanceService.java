package com.capstone.EventEase.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoField;
import java.time.ZonedDateTime;
import com.capstone.EventEase.Entity.*;
import com.capstone.EventEase.Exceptions.AttendanceCheckedException;
import com.capstone.EventEase.Exceptions.UserNotJoinedToAnEventException;
import com.capstone.EventEase.Repository.AttendanceRepository;
import com.capstone.EventEase.Repository.EventRepository;
import com.capstone.EventEase.Repository.UserEventRepository;
import com.capstone.EventEase.Repository.UserRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;


    private final UserRepository userRepository;

    private final EventRepository eventRepository;

    private final UserEventRepository repository;

    private static final ZoneId UTC_8 = ZoneId.of("Asia/Singapore");






    /*

    public Attendance checkAttendance(Long eventId, String username, OffsetDateTime attendanceDate){

        User user = userRepository.findByUsername(username);
        if(user == null){
            throw new EntityNotFoundException("User not Found!");
        }
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event with id " + eventId + " not found"));
        UserEvent userEvent = repository.findByUserAndEvent(user,event);
        if(userEvent == null){
            throw new EntityNotFoundException("User Is Not Joined To an Event!");
        }



        System.out.println("User: " + user.getUsername());
        System.out.println("Event: " + event.getId());
        System.out.println("UserEvent: " + userEvent.getId());

       Optional<Attendance> attendanceCheck = attendanceRepository.findByUserevent(userEvent);
      //  List<Attendance> attendances = attendanceRepository.findAllByUserevent(userEvent);
       // System.out.println("Attendances size is :" + attendances.size());




        if(attendanceCheck.isPresent()){
            long days = counterAttendance(event.getId());
            List<OffsetDateTime> attend = attendanceCheck.get().getAttendedTime();
            if(attend.size() < days){
                int len = attend.size()-1;


                LocalDateTime previousAttendedDate = attend.get(len).atZoneSameInstant(UTC_8).toLocalDateTime();
                LocalDateTime start = event.getEventStarts().atZoneSameInstant(UTC_8).toLocalDateTime();
                LocalDateTime end = event.getEventEnds().atZoneSameInstant(UTC_8).toLocalDateTime();


                LocalTime attendanceTime = attendanceDate.atZoneSameInstant(UTC_8).toLocalTime();
                boolean startsAfterTime = attendanceTime.isAfter(start.toLocalTime());
                boolean endsBeforeDeadline = attendanceTime.isBefore(end.toLocalTime());

                LocalTime noonTime = LocalTime.of(12,0);





                if(startsAfterTime && endsBeforeDeadline){


                }










                System.out.println("Attendance Size is : " + attend.size() + " While Days Size is: " + days);
                    attend.add(attendanceDate);
                    attendanceCheck.get().setAttendedTime(attend);
                    return attendanceRepository.save(attendanceCheck.get());



            }else{
                throw new EntityExistsException("Attendance Already Checked");
            }

        }else{
            System.out.println("No attendance found for UserEvent: " + userEvent.getId());

            LocalDateTime start = event.getEventStarts().atZoneSameInstant(UTC_8).toLocalDateTime();
            LocalDateTime end = event.getEventEnds().atZoneSameInstant(UTC_8).toLocalDateTime();




            LocalTime attendanceTime = attendanceDate.atZoneSameInstant(UTC_8).toLocalTime();
            boolean startsAfterTime = attendanceTime.isAfter(start.toLocalTime());
            boolean endsBeforeDeadline = attendanceTime.isBefore(end.toLocalTime());


           if(startsAfterTime && endsBeforeDeadline){
               List<OffsetDateTime> attend = new ArrayList<>();
               attend.add(attendanceDate);
               Attendance attendance = new Attendance();
               attendance.setUserevent(userEvent);
               attendance.setAttendedTime(attend);
               return attendanceRepository.save(attendance);
           }else{
               System.out.println("Sayup ka boi");
               System.out.println("Attendance After Time: " + startsAfterTime);
               System.out.println("Attendance Before Time: " + endsBeforeDeadline);


               System.out.println("Attendance Time is: " + attendanceTime);
               System.out.println("Start Time is: " + start);
               System.out.println("End Time is: " + end);
           }


        }
return null;
    }

     */


    public Attendance checkAttendance(Long eventId, String username, OffsetDateTime attendanceDate) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new EntityNotFoundException("User not Found!");
        }
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event with id " + eventId + " not found"));
        UserEvent userEvent = repository.findByUserAndEvent(user, event);
        if (userEvent == null) {
            throw new EntityNotFoundException("User Is Not Joined To an Event!");
        }

        ZonedDateTime zonedAttendanceDate = attendanceDate.atZoneSameInstant(UTC_8);
        ZonedDateTime eventStart = event.getEventStarts().atZoneSameInstant(UTC_8);
        ZonedDateTime eventEnd = event.getEventEnds().atZoneSameInstant(UTC_8);

        // Check if the attendance date is within the event period
        if (zonedAttendanceDate.isBefore(eventStart) || zonedAttendanceDate.isAfter(eventEnd)) {
            throw new IllegalArgumentException("Attendance date is outside the event period");
        }

        Optional<Attendance> attendanceCheck = attendanceRepository.findByUserevent(userEvent);

        if (attendanceCheck.isPresent()) {
            Attendance attendance = attendanceCheck.get();
            List<OffsetDateTime> attendedTimes = attendance.getAttendedTime();
            List<OffsetDateTime> timeoutTimes = attendance.getTimeOut();

            // Check if user has already timed out for this period
            if (isTimedOut(timeoutTimes, zonedAttendanceDate, eventStart, eventEnd)) {
                throw new IllegalStateException("Cannot attend. User has already timed out for this period.");
            }

            // Check if user has already attended for this period
            boolean alreadyAttended = isAlreadyAttended(attendedTimes, zonedAttendanceDate, eventStart, eventEnd);

            if (alreadyAttended) {
                throw new EntityExistsException("Attendance Already Checked for this period");
            }

            // Add new attendance
            attendedTimes.add(attendanceDate);
            attendance.setAttendedTime(attendedTimes);
            return attendanceRepository.save(attendance);
        } else {
            // Create new attendance record
            List<OffsetDateTime> attend = new ArrayList<>();
            attend.add(attendanceDate);
            Attendance attendance = new Attendance();
            attendance.setUserevent(userEvent);
            attendance.setAttendedTime(attend);
            attendance.setTimeOut(new ArrayList<>());
            return attendanceRepository.save(attendance);
        }
    }

    public Attendance checkTimeout(Long eventId, String username, OffsetDateTime timeoutDate) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new EntityNotFoundException("User not Found!");
        }
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event with id " + eventId + " not found"));
        UserEvent userEvent = repository.findByUserAndEvent(user, event);
        if (userEvent == null) {
            throw new EntityNotFoundException("User Is Not Joined To an Event!");
        }

        ZonedDateTime zonedTimeoutDate = timeoutDate.atZoneSameInstant(UTC_8);
        ZonedDateTime eventStart = event.getEventStarts().atZoneSameInstant(UTC_8);
        ZonedDateTime eventEnd = event.getEventEnds().atZoneSameInstant(UTC_8);

        // Check if the timeout date is within the event period
        if (zonedTimeoutDate.isBefore(eventStart) || zonedTimeoutDate.isAfter(eventEnd)) {
            throw new EntityNotFoundException("Timeout date is outside the event period");
        }

        Optional<Attendance> attendanceCheck = attendanceRepository.findByUserevent(userEvent);

        if (attendanceCheck.isPresent()) {
            Attendance attendance = attendanceCheck.get();
            List<OffsetDateTime> attendedTimes = attendance.getAttendedTime();
            List<OffsetDateTime> timeoutTimes = attendance.getTimeOut();

            // Check if user has attended for this period
            if (!isAlreadyAttended(attendedTimes, zonedTimeoutDate, eventStart, eventEnd)) {
                throw new EntityNotFoundException("Cannot timeout. User has not attended for this period.");
            }

            // Check if user has already timed out for this period
            boolean alreadyTimedOut = isTimedOut(timeoutTimes, zonedTimeoutDate, eventStart, eventEnd);

            if (alreadyTimedOut) {
                throw new EntityExistsException("Timeout Already Checked for this period");
            }

            // Add new timeout
            timeoutTimes.add(timeoutDate);
            attendance.setTimeOut(timeoutTimes);
            return attendanceRepository.save(attendance);
        } else {
            throw new EntityNotFoundException("No attendance record found for this user and event");
        }
    }

    private boolean isTimedOut(List<OffsetDateTime> timeoutTimes, ZonedDateTime currentDate,
                               ZonedDateTime eventStart, ZonedDateTime eventEnd) {
        LocalDate currentDay = currentDate.toLocalDate();
        LocalTime currentTime = currentDate.toLocalTime();
        LocalTime noonTime = LocalTime.of(12, 0);

        return timeoutTimes.stream()
                .map(time -> time.atZoneSameInstant(UTC_8))
                .anyMatch(time -> {
                    LocalDate timeDay = time.toLocalDate();
                    LocalTime timeOfDay = time.toLocalTime();

                    if (currentDay.equals(eventStart.toLocalDate()) || currentDay.equals(eventEnd.toLocalDate())) {
                        // First or last day of the event
                        return timeDay.equals(currentDay) &&
                                ((currentTime.isBefore(noonTime) && timeOfDay.isBefore(noonTime)) ||
                                        (currentTime.isAfter(noonTime) && timeOfDay.isAfter(noonTime)));
                    } else {
                        // Middle days of the event (if applicable)
                        return timeDay.equals(currentDay) &&
                                ((currentTime.isBefore(noonTime) && timeOfDay.isBefore(noonTime)) ||
                                        (currentTime.isAfter(noonTime) && timeOfDay.isAfter(noonTime)));
                    }
                });
    }

// The isAlreadyAttended method remains the same as in your original code



    private boolean isAlreadyAttended(List<OffsetDateTime> attendedTimes, ZonedDateTime attendanceDate,
                                      ZonedDateTime eventStart, ZonedDateTime eventEnd) {
        LocalDate attendanceDay = attendanceDate.toLocalDate();
        LocalTime attendanceTime = attendanceDate.toLocalTime();
        LocalTime noonTime = LocalTime.of(12, 0);

        return attendedTimes.stream()
                .map(time -> time.atZoneSameInstant(UTC_8))
                .anyMatch(time -> {
                    LocalDate timeDay = time.toLocalDate();
                    LocalTime timeOfDay = time.toLocalTime();

                    if (attendanceDay.equals(eventStart.toLocalDate())) {
                        // First day of the event
                        return timeDay.equals(attendanceDay) &&
                                ((attendanceTime.isBefore(noonTime) && timeOfDay.isBefore(noonTime)) ||
                                        (attendanceTime.isAfter(noonTime) && timeOfDay.isAfter(noonTime)));
                    } else if (attendanceDay.equals(eventEnd.toLocalDate())) {
                        // Last day of the event
                        return timeDay.equals(attendanceDay) &&
                                ((attendanceTime.isBefore(noonTime) && timeOfDay.isBefore(noonTime)) ||
                                        (attendanceTime.isAfter(noonTime) && timeOfDay.isAfter(noonTime)));
                    } else {
                        // Middle days of the event (if applicable)
                        return timeDay.equals(attendanceDay) &&
                                ((attendanceTime.isBefore(noonTime) && timeOfDay.isBefore(noonTime)) ||
                                        (attendanceTime.isAfter(noonTime) && timeOfDay.isAfter(noonTime)));
                    }
                });
    }

    public long countDays(Long eventId){

        Event event = eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event not Found"));
        OffsetDateTime eventStarts = event.getEventStarts();
        OffsetDateTime eventEnds = event.getEventEnds();
        Duration duration = Duration.between(eventStarts,eventEnds);
        return  duration.toDays();
    }

    public long countAttendance(long countDays, Long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event not Found!"));
        OffsetDateTime start = event.getEventStarts();
        OffsetDateTime end = event.getEventEnds();

        LocalTime noonTime = LocalTime.of(12, 0); // 12:00 PM
        LocalTime endTime = end.toLocalTime();

        if (countDays == 0) {
            return endTime.isAfter(noonTime) ? 2 : 1;
        } else if (countDays > 0) {
            return countDays * 2;
        }

        return 0;
    }

    /*
    public long counterAttendance(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not Found!"));

        // Convert OffsetDateTime to LocalDateTime in UTC-8
        LocalDateTime start = event.getEventStarts().atZoneSameInstant(UTC_8).toLocalDateTime();
        LocalDateTime end = event.getEventEnds().atZoneSameInstant(UTC_8).toLocalDateTime();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        System.out.println("Event Start (UTC-8): " + start.format(formatter));
        System.out.println("Event End (UTC-8): " + end.format(formatter));

        LocalTime noonTime = LocalTime.of(12, 0); // 12:00 PM

        long days = ChronoUnit.DAYS.between(start.toLocalDate(), end.toLocalDate());
        System.out.println("Days between: " + days);

        if (days == 0) {
            // Same day event
            boolean startsBeforeNoon = start.toLocalTime().isBefore(noonTime);
            boolean endsAfterNoon = end.toLocalTime().isAfter(noonTime);
            System.out.println("Same day event");
            System.out.println("Starts before noon: " + startsBeforeNoon);
            System.out.println("Ends after noon: " + endsAfterNoon);
            long result = (startsBeforeNoon && endsAfterNoon) ? 2 : 1;
            System.out.println("Returning: " + result);
            return result;
        } else {
            System.out.println("Multi-day event");
            // Multi-day event
            long count = 0;

            // First day
           // count += start.toLocalTime().isBefore(noonTime) ? 2 : 1;
          //  System.out.println("After first day: " + count);

            // Full days in between



            count += days * 2;
            System.out.println("After full days: " + count);

            // Last day
            count += end.toLocalTime().isAfter(noonTime) ? 2 : 1;
            System.out.println("After last day: " + count);

            // Subtract 1 from the count if the last day ends exactly at noon
            if (end.toLocalTime().equals(noonTime)) {
                count -= 1;
                System.out.println("Subtracted 1 for noon end: " + count);
            }

            System.out.println("Returning: " + count);
            return count;
        }
    }

     */

    public long counterAttendance(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not Found!"));

        // Convert OffsetDateTime to LocalDateTime in UTC-8
        LocalDateTime start = event.getEventStarts().atZoneSameInstant(UTC_8).toLocalDateTime();
        LocalDateTime end = event.getEventEnds().atZoneSameInstant(UTC_8).toLocalDateTime();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        System.out.println("Event Start (UTC-8): " + start.format(formatter));
        System.out.println("Event End (UTC-8): " + end.format(formatter));

        LocalTime noonTime = LocalTime.of(12, 0); // 12:00 PM

        long days = ChronoUnit.DAYS.between(start.toLocalDate(), end.toLocalDate());
        System.out.println("Days between: " + days);

        if (days == 0) {
            // Same day event
            boolean startsBeforeNoon = start.toLocalTime().isBefore(noonTime);
            boolean endsAfterNoon = end.toLocalTime().isAfter(noonTime);
            System.out.println("Same day event");
            System.out.println("Starts before noon: " + startsBeforeNoon);
            System.out.println("Ends after noon: " + endsAfterNoon);
            long result = (startsBeforeNoon && endsAfterNoon) ? 2 : 1;
            System.out.println("Returning: " + result);
            return result;
        } else {
            System.out.println("Multi-day event");
            // Multi-day event
            long count = 0;

            // First day
            count += start.toLocalTime().isBefore(noonTime) ? 2 : 1;
            System.out.println("After first day: " + count);

            // Full days in between
            if (days > 1) {
                count += (days - 1) * 2;
            }
            System.out.println("After full days: " + count);

            // Last day
            count += end.toLocalTime().isAfter(noonTime) ? 2 : 1;
            System.out.println("After last day: " + count);

            // Subtract 1 from the count if the last day ends exactly at noon
            if (end.toLocalTime().equals(noonTime)) {
                count -= 1;
                System.out.println("Subtracted 1 for noon end: " + count);
            }

            System.out.println("Returning: " + count);
            return count;
        }
    }



    public boolean checkIfAttendedEvent(Long eventId, Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not Found!"));
        if(user == null){
            throw new EntityNotFoundException("User not Found!");
        }
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event with id " + eventId + " not found"));
        UserEvent userEvent = repository.findByUserAndEvent(user,event);
        Optional<Attendance> attendance = attendanceRepository.findByUserevent(userEvent);

        if(!attendance.isPresent()){
            return false;
        }
        return true;
    }


    public User verifyUser(Long eventId,String username) throws UserNotJoinedToAnEventException,
            AttendanceCheckedException {
        User user = userRepository.findByUsername(username);
        if(user == null){
            throw new EntityNotFoundException("User not Found!");
        }
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event with id " + eventId + " not found"));
        UserEvent userEvent = repository.findByUserAndEvent(user,event);
        if(userEvent == null){
            throw new UserNotJoinedToAnEventException("User is not Joined to the Event");
        }
        /*
        boolean didAttend = checkIfAttendedEvent(eventId,user.getId());

        if(didAttend){
           throw new AttendanceCheckedException("User already Checked for Attendance");
        }

         */


        return user;
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
                .distinct().toList();

        List<UserAttendance> userAttendances = users.stream().map(user ->
                new UserAttendance(user,getNumberofAttendance(user.getId(),allAttendances))).toList();;


        return userAttendances.stream().sorted((user1,user2) -> Long.compare(user2.getAttendanceCount(),user1.getAttendanceCount()))
                .limit(3).collect(Collectors.toList());
    }



    public List<Event> getAllEventsJoinedByUserAfterAttendance(Long userId){
        return attendanceRepository.findAll().stream().filter(attendance -> attendance.getUserevent()
                .getUser().getId().equals(userId))
                 .map(attendance -> attendance.getUserevent().getEvent())
                .collect(Collectors.toList());
    }

    public List<User> getAllUsersJoinedToEventAfterAttendance(Long eventId){
        return attendanceRepository.findAll().stream().filter(
                attendance -> attendance.getUserevent().getEvent().getId().equals(eventId)
        ).map(attendance -> attendance.getUserevent().getUser())
                .collect(Collectors.toList());
    }








}
