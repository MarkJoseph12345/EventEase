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
import java.util.logging.Logger;
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

    private static final Logger logger = Logger.getLogger(EventService.class.getName());



    private byte[] getDefaultProfilePicture (){

        try{
            Path path = Paths.get(new ClassPathResource("static/images/lyza.jpg").getURI());
            return Files.readAllBytes(path);
        }catch (IOException e){
            System.out.println("Error: " + e.getMessage());
            return new byte[0];
        }
    }

    public Event createEvent(String nameUser, Event event) throws GenderNotAllowedException, DoubleJoinException, EventFullException, UserBlockedException,
            EntityNotFoundException {

        User userCreator = userRepository.findByUsername(nameUser);
        if (userCreator == null) {
            throw new EntityNotFoundException("User Not Found!");
        }
        event.setCreatedBy(userCreator.getUsername());
        validateEventDates(event);

        Event newEvent = eventRepository.save(event);
        List<String> passwords = new ArrayList<>();
        List<EmailSendRequestDTO> emails = new ArrayList<>();

        for (String username : event.getPreRegisteredUsers()) {
            User user = createUser(username, passwords);
            emails.add(createEmailDTO(username));
            userEventService.joinEvent(user.getId(), newEvent.getId());
        }

        emailService.emailSend(emails, passwords, newEvent);
        logEventData(newEvent);
        return newEvent;
    }


    

    private void validateEventDates(Event event) {
        ZonedDateTime currentDate = ZonedDateTime.now(UTC_8);
        ZonedDateTime eventStart = event.getEventStarts().atZoneSameInstant(UTC_8);
        ZonedDateTime eventEnd = event.getEventEnds().atZoneSameInstant(UTC_8);

        if (eventStart.isBefore(currentDate) || eventEnd.isBefore(currentDate)) {
            throw new DateTimeException("Event cannot start or end before the current date.");
        }

        List<Event> events = eventRepository.findAll();
        for (Event e : events) {
            ZonedDateTime eStart = e.getEventStarts().atZoneSameInstant(UTC_8);
            ZonedDateTime eEnd = e.getEventEnds().atZoneSameInstant(UTC_8);
            if (eventStart.isBefore(eEnd) || eventStart.isBefore(eStart)) {
                throw new DateTimeException("Event cannot start or end before the current date.");
            }
        }
    }

    private User createUser(String username, List<String> passwords) {
        User findUser = userRepository.findByUsername(username);
        if (findUser != null) {
            throw new EntityExistsException("User: " + findUser.getUsername() + " Already has an account");
        }

        PasswordGenerator passwordGenerator = new PasswordGenerator();
        String userPass = passwordGenerator.generatePassword(8);
        User user = User.builder()
                .firstName("FirstName")
                .lastName("LastName")
                .username(username)
                .uuid(UUID.randomUUID().toString())
                .IdNumber("99-999-99")
                .password(passwordEncoder.encode(userPass))
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
        passwords.add(userPass);
        return user;
    }

    private EmailSendRequestDTO createEmailDTO(String username) {
        return EmailSendRequestDTO.builder()
                .message("You have Been Invited To An Event From EventEase")
                .subject("EventEase Event Invite")
                .receiver(username)
                .build();
    }


    public void logEventData(Event event) {
        logger.info("Event Data Picture is: " + Arrays.toString(event.getEventPicture()));
        logger.info("Event Name is: " + event.getEventName());
    }




    public Event getEvent(Long eventId) {
        return eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event Dont Exists!"));
    }


    public String deleteEvent(Long eventId) throws EntityNotFoundException {
        Event event = getEvent(eventId);
        List<UserEvent> userEvents = userEventRepository.findByEventId(eventId);

        for (UserEvent userEvent : userEvents) {
            attendanceRepository.findByUserevent(userEvent).ifPresent(attendanceRepository::delete);
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
        Event oldEvent = getEvent(eventId);

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
        Event event = getEvent(eventId);
        return event.getEventStarts();
    }




    public User getUser(Long userId){
        return userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User Not Found"));
    }


    public Event likeEvent(Long eventId, Long userId) {
        Event event = getEvent(eventId);
        User user = getUser(userId);

        if (hasUserLikedEvent(event, user)) {
            throw new IllegalStateException("User already liked the event");
        }

        likeEventAndUpdate(event, user);

        return event;
    }

    private boolean hasUserLikedEvent(Event event, User user) {
        return event.getUsersLiked().contains(user.getUsername());
    }

    private void likeEventAndUpdate(Event event, User user) {
        event.setLikes(event.getLikes() + 1);
        event.getUsersLiked().add(user.getUsername());

        if (event.getUsersDisliked().contains(user.getUsername())) {
            event.setDislikes(event.getDislikes() - 1);
            event.getUsersDisliked().remove(user.getUsername());
        }

        eventRepository.save(event);
    }

    public Event dislikeEvent(Long eventId, Long userId) {
        Event event = getEvent(eventId);
        User user = getUser(userId);

        if (event.getUsersDisliked().contains(user.getUsername())) {
            throw new IllegalStateException("User already disliked the event");
        }

        event.setDislikes(event.getDislikes() + 1);
        event.getUsersDisliked().add(user.getUsername());

        if (event.getUsersLiked().contains(user.getUsername())) {
            event.setLikes(event.getLikes() - 1);
            event.getUsersLiked().remove(user.getUsername());
        }

        eventRepository.save(event);
        return event;
    }


    public Optional<Event> getEventByNow() {
        return eventRepository.findByCurrentEvent(OffsetDateTime.now());
    }



}
