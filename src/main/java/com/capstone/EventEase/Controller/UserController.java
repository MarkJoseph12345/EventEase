package com.capstone.EventEase.Controller;

import com.capstone.EventEase.Entity.User;
import com.capstone.EventEase.Exceptions.EntityNotDeletedException;
import com.capstone.EventEase.Repository.UserRepository;
import com.capstone.EventEase.Service.ImageService;
import com.capstone.EventEase.Service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "USER CONTROLLER", description = "THIS IS WHERE THE USER CONTROLLERS ARE")
public class UserController {


    private final UserService userService;

    private final ImageService imageService;


   // @Tag(name = "userGET")
    @Operation(summary = "Greet The User")
    @GetMapping("/hello")
    public ResponseEntity<String> greet(){
        return new ResponseEntity<>("Hello World User",HttpStatus.OK);
    }





    //@Tag(name = "userGET")
    @Operation(summary = "Gets the User By Passing an Id", description = "This will return the user based on the id passed")
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) throws Exception{
        return new ResponseEntity<>(userService.getUserById(userId), HttpStatus.OK);
    }


   // @Tag(name = "userGET")
    @Operation(summary = "Gets the users profile picture by sending an id")
    @GetMapping("/getProfilePicture/{userId}")
    public ResponseEntity<?> getProfilePicture(@PathVariable Long userId) throws IOException{

        String format = imageService.getPictureFormat(userId,false);

        MediaType mediaType;

        switch (format) {
            case "png":
                mediaType = MediaType.IMAGE_PNG;
                break;
            case "jpg":
            case "jpeg":
            case "jfif":
                mediaType = MediaType.IMAGE_JPEG;
                break;
            case "gif":
                mediaType = MediaType.IMAGE_GIF;
                break;
            case "bmp":
                mediaType = MediaType.valueOf("image/bmp");
                break;
            case "tiff":
                mediaType = MediaType.valueOf("image/tiff");
                break;
            case "webp":
                mediaType = MediaType.valueOf("image/webp");
                break;
            case "svg":
                mediaType = MediaType.valueOf("image/svg+xml");
                break;
            default:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unsupported Format: " + format);
        }
        byte[] profilePicture = imageService.downloadImage(userId,false);
        return ResponseEntity.status(HttpStatus.OK).contentType(mediaType).body(profilePicture);

    }


    //@Tag(name = "userGET")
    @Operation(summary = "gets all the users in the system")
    @GetMapping("/getAllUsers")
    public List<User> getAllUsers(){
         return userService.getAllUsers();
    }



   // @Tag(name = "userPUT")
    @Operation(summary = "Update Profile Picture",description = "The user can update his/her profile picture by" +
            "passing an id and an image ")
    @PutMapping("/updateProfilePicture/{userId}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long userId, @RequestParam("image")
    MultipartFile file) throws Exception {
        return new ResponseEntity<>(imageService.uploadImage(userId,file,false),HttpStatus.OK);
    }


   //    @Tag(name = "userDELETE")
    @Operation(summary = "User can delete account by passing their id")
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



    @Operation(summary = "Check if uuid")
    @GetMapping("/getByUUID/{uuid}")
    public ResponseEntity<?> checkUuid(@PathVariable String uuid){
            return ResponseEntity.ok(userService.getByUuid(uuid));
    }




















}
