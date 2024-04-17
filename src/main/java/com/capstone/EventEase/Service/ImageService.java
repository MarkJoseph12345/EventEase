package com.capstone.EventEase.Service;


import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Repository.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class ImageService {




    private final String userHome = System.getProperty("user.home");
    private final Path root = Paths.get(userHome,"ProfilePictures");
    private final UserRepository userRepository;


    @PostConstruct
    public void init() throws IOException {
        if(!Files.exists(root) && !Files.isDirectory(root)){
            Files.createDirectories(root);
        }
    }




    /*


    public void uploadImage(User user, MultipartFile file) throws IOException{

            if(user.getProfilePicture() != null){
                deleteImage(user.getProfilePicture());
            }

            String fileExension = StringUtils.getFilenameExtension(file.getOriginalFilename());

            String fileName = "User Profile: " +  user.getIdNumber() + "." + fileExension;
            user.setProfilePicture(fileName);
            Path filePath = root.resolve(fileName);
            file.transferTo(filePath);
    }


     */



    public String uploadImage(Long userId,MultipartFile file) throws IOException{

            User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User dont exists"));

            if(user.getProfilePicture() != null){
                deleteImage(user.getProfilePicture());
            }
            String fileExtension =  StringUtils.getFilenameExtension(file.getOriginalFilename());
            String fileName = "ProfilePictureID_" + userId + "." + fileExtension;
            user.setProfilePicture(fileName);
            userRepository.save(user);
            Path filePath = root.resolve(fileName);
            file.transferTo(filePath);

           return "Image has been uploaded!";
    }








    public String uploadImage(MultipartFile file) throws IOException{
            if(file.getOriginalFilename() == null){
                throw new IOException("Filename is null!");
            }
            String fileName = file.getOriginalFilename();
            Path filePath = root.resolve(fileName);
            file.transferTo(filePath);
            return "Image Succeded";
    }

    public byte[] downloadImage(String fileName) throws IOException{
        Path filePath = root.resolve(fileName);
        return Files.readAllBytes(filePath);

    }

    public byte[] downloadImage(Long userId) throws IOException{
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not Found!"));
        Path filePath = root.resolve(user.getProfilePicture());
        return Files.readAllBytes(filePath);
    }


    public void deleteImage(String fileName) throws IOException{
        Path filePath = root.resolve(fileName);
        Files.deleteIfExists(filePath);
    }




}
