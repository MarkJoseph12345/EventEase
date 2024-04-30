
package com.capstone.EventEase.Controller;


import com.capstone.EventEase.Service.AdminService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/admin")
@RequiredArgsConstructor
public class AdminController {


    private final AdminService adminService;


    @GetMapping("/attend/{idNumber}")
    public ResponseEntity<?> attendUsers(@PathVariable String idNumber){
        try{
            return new ResponseEntity<>(adminService.checkAttendance(idNumber),HttpStatus.OK);
        }catch (EntityNotFoundException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.CONFLICT);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.BAD_REQUEST);
        }
    }



}


