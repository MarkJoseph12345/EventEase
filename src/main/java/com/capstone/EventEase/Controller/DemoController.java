package com.capstone.EventEase.Controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/demo-controller")
public class DemoController {





    @GetMapping()
    public ResponseEntity<String> getMessage(){
        return new ResponseEntity<>("Hello from authenticated", HttpStatus.OK);
    }
}
