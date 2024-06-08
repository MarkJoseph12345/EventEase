
package com.capstone.EventEase.Controller;


import com.capstone.EventEase.Service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/admin")
@RequiredArgsConstructor
@Tag(name = "ADMIN CONTROLLER", description = "THIS IS THE ADMIN CONTROLLER")
public class AdminController {

    private final AdminService adminService;
    @Operation(summary = "Check The Attendance of the User")
    @PostMapping("/attend/{username}")
    public ResponseEntity<?> attendUsers(@PathVariable String username){
        try{
            return new ResponseEntity<>(adminService.checkAttendance(username),HttpStatus.OK);
        }catch (EntityNotFoundException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.CONFLICT);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.BAD_REQUEST);
        }
    }


}


