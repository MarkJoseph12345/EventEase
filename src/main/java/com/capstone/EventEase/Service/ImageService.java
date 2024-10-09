package com.capstone.EventEase.Service;


import com.capstone.EventEase.Entity.Event;
import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Repository.EventRepository;
import com.capstone.EventEase.Repository.UserRepository;
import com.capstone.EventEase.UTIL.ImageUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;


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
    public String uploadImage(Long id, MultipartFile file, boolean isEvent) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        try {
            if (isEvent) {
                Event event = getEventById(id);
                event.setEventPictureName(file.getOriginalFilename());
                byte[] images = ImageUtils.compressImage(file.getBytes());
                event.setEventPicture(images);
                event.setEventPictureType(file.getContentType());
                eventRepository.save(event);
                return "Uploaded event image successfully";
            } else {
                User user = getUserById(id);
                user.setProfilePictureName(file.getOriginalFilename());
                byte[] compressedImage = ImageUtils.compressImage(file.getBytes());
                user.setProfilePicture(compressedImage);
                user.setProfilePictureType(file.getContentType());
                userRepository.save(user);
                return "Uploaded user image successfully";
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to read the image data", e);
        }
    }


    @Transactional(readOnly = true)
    public byte[] downloadImage(Long id, boolean isEvent){
        return isEvent ? ImageUtils.decompressImage(getEventById(id).getEventPicture())
                :ImageUtils.decompressImage(getUserById(id).getProfilePicture());
    }



    public String getPictureFormat(Long id, boolean isEvent){
        String pictureName = isEvent ? getEventById(id).getEventPictureName():getUserById(id).getProfilePictureName();
            return pictureName.substring(pictureName.lastIndexOf(".") + 1);
    }






}
