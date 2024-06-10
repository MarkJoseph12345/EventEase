
package com.capstone.EventEase.Controller;


import com.capstone.EventEase.Entity.UserAttendance;
import com.capstone.EventEase.Service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/admin")
@RequiredArgsConstructor
@Tag(name = "ADMIN CONTROLLER", description = "THIS IS THE ADMIN CONTROLLER")
public class AdminController {



    private final AttendanceService attendanceService;
    @Operation(summary = "Check The Attendance of the User")
    @PostMapping("/attend/{eventId}/{username}/")
    public ResponseEntity<?> attendUsers(@PathVariable Long eventId, @PathVariable String username,@RequestParam("attendanceDate") @DateTimeFormat(
            iso = DateTimeFormat.ISO.DATE_TIME)OffsetDateTime attendanceDate){
        try{
            return new ResponseEntity<>(attendanceService.checkAttendance(eventId,username,attendanceDate),HttpStatus.OK);
        }catch (EntityNotFoundException e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()), HttpStatus.CONFLICT);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("messages",e.getMessage()),HttpStatus.BAD_REQUEST);
        }
    }


    /*
    @Operation(summary = "Get The Number of Attended by UserId")
    @GetMapping("/getAttendance/{userId}")
    public int getAttendanceCount(@PathVariable Long userId){
        return attendanceService.getNumberofAttendance(userId);
    }

     */


    @Operation(summary = "Get The Number of Attended by UserId")
    @GetMapping("/getTopThree")
    public ResponseEntity<List<UserAttendance>> getTopThree() {
        List<UserAttendance> topThreeUsers = attendanceService.getTopThreeUsersByAttendance();
        return ResponseEntity.ok(topThreeUsers);
    }






}


