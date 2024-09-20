package com.capstone.EventEase.Service;


import com.capstone.EventEase.Entity.Event;
import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Repository.EventRepository;
import com.capstone.EventEase.Repository.UserRepository;
import com.capstone.EventEase.UTIL.ImageUtils;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImageService {




    private final UserRepository userRepository;


    private final EventRepository eventRepository;



    public User getUserById(Long userId){
        return userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not Found!"));
    }

    public Event getEventById(Long eventId){
        return eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event not Found!"));
    }

    @Transactional
    public String uploadEventImage(Long eventId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        Event event = getEventById(eventId);

        try {
            event.setEventPictureName(file.getOriginalFilename());
            byte[] images = ImageUtils.compressImage(file.getBytes());
            event.setEventPicture(images);
            event.setEventPictureType(file.getContentType());
            eventRepository.save(event);
            return "Uploaded image successfully";
        } catch (IOException e) {
            throw new RuntimeException("Failed to read the image data", e);
        }
    }


    

    @Transactional
    public String uploadUserImage(Long userId,MultipartFile file){

        if(file.isEmpty()){
            throw new IllegalArgumentException("File is empty");
        }

        User user = getUserById(userId);
        try{
            user.setProfilePictureName(file.getOriginalFilename());

            byte[] compressedImage = ImageUtils.compressImage(file.getBytes());

            user.setProfilePicture(compressedImage);

            user.setProfilePictureType(file.getContentType());
            userRepository.save(user);
            return "Uploaded Image Sucessfulyy";
        }catch (IOException e){
                throw new RuntimeException("Failed to read the file data");
        }
    }


    /*

    @Transactional
public String uploadImage(Object entity, MultipartFile file) {
    if (file.isEmpty()) {
        throw new IllegalArgumentException("File is empty");
    }

    try {
        String originalFilename = file.getOriginalFilename();
        byte[] compressedImage = ImageUtils.compressImage(file.getBytes());
        String contentType = file.getContentType();

        if (entity instanceof User) {
            User user = (User) entity;
            user.setProfilePictureName(originalFilename);
            user.setProfilePicture(compressedImage);
            user.setProfilePictureType(contentType);
            userRepository.save(user);
            return "Uploaded user image successfully";
        } else if (entity instanceof Event) {
            Event event = (Event) entity;
            event.setEventPictureName(originalFilename);
            event.setEventPicture(compressedImage);
            event.setEventPictureType(contentType);
            eventRepository.save(event);
            return "Uploaded event image successfully";
        } else {
            throw new IllegalArgumentException("Unsupported entity type");
        }
    } catch (IOException e) {
        throw new RuntimeException("Failed to read the image data", e);
    }
}

     */


    @Transactional(readOnly = true)
    public byte[] downloadUserImage(Long userId){
            return  ImageUtils.decompressImage(getUserById(userId).getProfilePicture());
    }

    @Transactional(readOnly = true)
    public byte[] downloadEventImage(Long eventId){
        return ImageUtils.decompressImage(getEventById(eventId).getEventPicture());
    }

    public String getUserPictureFormat(Long userId){
        User user = getUserById(userId);
        String profileName = user.getProfilePictureName();
        return profileName.substring(profileName.lastIndexOf(".") + 1);
    }

    public String getEventPictureFormat(Long eventId){
        Event event = getEventById(eventId);
        String eventPictureName = event.getEventPictureName();
        return eventPictureName.substring(eventPictureName.lastIndexOf(".") + 1);
    }




}
