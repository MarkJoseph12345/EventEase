package com.capstone.EventEase.Service;

import com.capstone.EventEase.Classes.PasswordGenerator;
import com.capstone.EventEase.DTO.Request.EmailSendRequestDTO;
import com.capstone.EventEase.ENUMS.Gender;
import com.capstone.EventEase.ENUMS.Role;
import com.capstone.EventEase.Entity.Attendance;
import com.capstone.EventEase.Entity.Event;
import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Entity.UserEvent;
import com.capstone.EventEase.Exceptions.DoubleJoinException;
import com.capstone.EventEase.Exceptions.EventFullException;
import com.capstone.EventEase.Exceptions.GenderNotAllowedException;
import com.capstone.EventEase.Exceptions.UserBlockedException;
import com.capstone.EventEase.Repository.AttendanceRepository;
import com.capstone.EventEase.Repository.EventRepository;
import com.capstone.EventEase.Repository.UserEventRepository;

import com.capstone.EventEase.Repository.UserRepository;
import com.capstone.EventEase.UTIL.ImageUtils;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

//import org.springframework.web.multipart.MultipartFile;

import javax.swing.plaf.multi.MultiTabbedPaneUI;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    private final UserEventRepository userEventRepository;

    private final UserRepository userRepository;

    private final AttendanceRepository attendanceRepository;


    private final ImageService imageService;

    private final UserEventService userEventService;

    private final EmailService emailService;

    private final PasswordEncoder passwordEncoder;

    private static final ZoneId UTC_8 = ZoneId.of("Asia/Singapore");


    private byte[] getDefaultProfilePicture (){

        try{
            Path path = Paths.get(new ClassPathResource("static/images/lyza.jpg").getURI());
            return Files.readAllBytes(path);
        }catch (IOException e){
            System.out.println("Error: " + e.getMessage());
            return new byte[0];
        }
    }



    public Event createEvent(Event event) throws GenderNotAllowedException, DoubleJoinException, EventFullException, UserBlockedException,
            EntityNotFoundException{
        Set<String> usernames = event.getPreRegisteredUsers();

        List<User> users = new ArrayList<>();
        List<EmailSendRequestDTO> emails = new ArrayList<>();

        ZonedDateTime currentDate = ZonedDateTime.now(UTC_8);
        ZonedDateTime eventStart = event.getEventStarts().atZoneSameInstant(UTC_8);
        ZonedDateTime eventEnd = event.getEventEnds().atZoneSameInstant(UTC_8);




        if(eventStart.isBefore(currentDate) || eventEnd.isBefore(currentDate)){
            throw new DateTimeException("Event cannot start or end before the current date.");
        }




        List<Event> events = eventRepository.findAll();
        for(Event e:events){
            ZonedDateTime eStart = e.getEventStarts().atZoneSameInstant(UTC_8);
            ZonedDateTime eEnd = e.getEventEnds().atZoneSameInstant(UTC_8);
            if(eventStart.isBefore(eEnd) || eventStart.isBefore(eStart)){
                throw new DateTimeException("Event cannot start or end before the current date.");
            }

        }


        Event newEvent = eventRepository.save(event);

        for(String username: usernames){

            User findUser = userRepository.findByUsername(username);
            if(findUser != null){
                throw new EntityExistsException("User Already Has Account!");
            }

            PasswordGenerator passwordGenerator = new PasswordGenerator();
            User user = User.builder()
                    .firstName("FirstName")
                    .lastName("LastName")
                    .username(username)
                    .uuid(UUID.randomUUID().toString())
                    .IdNumber("99-999-99")
                    .password(passwordEncoder.encode(passwordGenerator.generatePassword(8)))
                    .department("")
                    .gender(Gender.valueOf("MALE"))
                    .isBlocked(false)
                    .isVerified(true)
                    .role(Role.STUDENT)
                    .profilePicture(ImageUtils.compressImage(getDefaultProfilePicture()))
                    .profilePictureName("XyloGraph1.png")
                    .profilePictureType("image/png")
                    .build();
            userRepository.save(user);



        emails.add(EmailSendRequestDTO.builder().
                message("You have Been Invited To An Event From EventEase")
                .subject("EventEase Event Invite").receiver(username)
                .build());
        UserEvent userEvent = userEventService.joinEvent(user.getId(),newEvent.getId());
        }


        emailService.emailSend(emails,eventRepository.save(newEvent));
        eventData(eventRepository.save(newEvent));
        return eventRepository.save(newEvent);
    }

    public void eventData(Event event){

        System.out.println("Event Data Picture is: " + Arrays.toString(event.getEventPicture()));
        System.out.println("Event Name is : " + event.getEventName());
    }


    public Event getEvent(Long eventId) {
        return eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event Dont Exists!"));
    }


    public String deleteEvent(Long eventId) throws EntityNotFoundException {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event Dont Exists!"));
        List<UserEvent> userEvents = userEventRepository.findByEventId(eventId);


        List<Attendance> attendanceList = attendanceRepository.findAll();

        for (UserEvent userEvent : userEvents) {
            Optional<Attendance> attend = attendanceRepository.findByUserevent(userEvent);
            attend.ifPresent(attendanceRepository::delete);
        }

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

        ZonedDateTime currentDate = ZonedDateTime.now(UTC_8);
        ZonedDateTime eventStart = oldEvent.getEventStarts().atZoneSameInstant(UTC_8);
        ZonedDateTime eventEnd = oldEvent.getEventEnds().atZoneSameInstant(UTC_8);



        if(currentDate.isAfter(eventStart) && currentDate.isBefore(eventEnd)){
            throw new DateTimeException("Event Can't Be Updated During Event Starts");
        }
        if(currentDate.isAfter(eventEnd)){
            throw new DateTimeException("Event Can't Be Updated After Event Ends");
        }

        if (event.getEventName() != null && !event.getEventName().isEmpty()) {
            oldEvent.setEventName(event.getEventName());
        }
        if (event.getEventDescription() != null && !event.getEventDescription().isEmpty()) {
            oldEvent.setEventDescription(event.getEventDescription());
        }
        if (event.getEventStarts() != null) {
            oldEvent.setEventStarts(event.getEventStarts());
        }
        if (event.getEventEnds() != null) {
            oldEvent.setEventEnds(event.getEventEnds());
        }
        if (event.getDepartment() != null && !event.getDepartment().isEmpty()) {
            oldEvent.setDepartment(event.getDepartment());
        }
        if (event.getEventType() != null && !event.getEventType().isEmpty()) {
            oldEvent.setEventType(event.getEventType());
        }
        if (event.getEventLimit() != null && event.getEventLimit() > 0) {
            oldEvent.setEventLimit(event.getEventLimit());
        }

        if (event.getAllowedGender() != null) {
            oldEvent.setAllowedGender(event.getAllowedGender());
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


    public Optional<Event> getEventByNow() {
        return eventRepository.findByCurrentEvent(OffsetDateTime.now());
    }



}
