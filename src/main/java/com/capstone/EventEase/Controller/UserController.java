package com.capstone.EventEase.Controller;

import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Exceptions.EntityNotDeletedException;
import com.capstone.EventEase.Repository.UserRepository;
import com.capstone.EventEase.Service.ImageService;
import com.capstone.EventEase.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/user")
@RequiredArgsConstructor
public class UserController {


    private final UserService userService;

    private final ImageService imageService;







    @GetMapping("/hello")
    public ResponseEntity<String> greet(){
        return new ResponseEntity<>("Hello World yawa mo tanan",HttpStatus.OK);
    }


    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) throws Exception{
        return new ResponseEntity<>(userService.getUserById(userId), HttpStatus.OK);
    }



    @GetMapping("/getProfilePicture/{userId}")
    public ResponseEntity<?> getProfilePicture(@PathVariable Long userId) throws IOException{
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.valueOf("image/png"))
                .body(imageService.downloadUserImage(userId));
    }

    @GetMapping("/getProfilePicture/svg/{userId}")
    public ResponseEntity<byte[]> getProfilePictureSvg(@PathVariable Long userId) throws IOException {
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.valueOf("image/svg"))
                .body(imageService.downloadUserImage(userId));
    }






    @GetMapping("/getAllUsers")
    public List<User> getAllUsers(){
         return userService.getAllUsers();
    }



    @PutMapping("/updateProfilePicture/{userId}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long userId, @RequestParam("image")
    MultipartFile file) throws Exception {
        return new ResponseEntity<>(imageService.uploadUserImage(userId,file),HttpStatus.OK);
    }




    @DeleteMapping("/deleteUser/{userId}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long userId){
        try{
            return new ResponseEntity<>(userService.deleteUserById(userId),HttpStatus.OK);
        }catch (EntityNotDeletedException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser  = (User) authentication.getPrincipal();
        return ResponseEntity.ok(currentUser);
    }











}
