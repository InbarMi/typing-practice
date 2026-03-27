package com.inbarmi.typing_app_api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import com.inbarmi.typing_app_api.service.TypingSessionService;
import com.inbarmi.typing_app_api.dto.*;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/sessions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class TypingSessionController {

    private TypingSessionService service;

    public TypingSessionController(TypingSessionService service) {
        this.service = service;
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<TypingSessionResponse> createSession(@PathVariable String userId, @RequestBody TypingSessionRequest request) {
        TypingSessionResponse response = service.saveTypingSession(userId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TypingSessionResponse> getSessionById(@PathVariable Long id) {
        TypingSessionResponse response = service.getSessionById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TypingSessionResponse>> getAllUserSessions(@PathVariable String userId) {
        List<TypingSessionResponse> responses = service.getAllSessionsForUser(userId);
        return ResponseEntity.ok(responses);
    }
}
    
    

