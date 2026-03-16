package com.inbarmi.typing_app_api.controller;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import static org.mockito.Mockito.*;
import com.inbarmi.typing_app_api.service.TypingSessionService;
import com.inbarmi.typing_app_api.dto.*;
import com.inbarmi.typing_app_api.exception.ResourceNotFoundException;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class TypingSessionControllerTest {

    @Mock
    private TypingSessionService service;

    @InjectMocks
    private TypingSessionController controller;

    // POST /sessions/user/{userId}
    @Test
    void createSession_validRequest_returnsCreatedResponse() {
        TypingSessionRequest request = new TypingSessionRequest(300, 270, 60);

        TypingSessionResponse response = new TypingSessionResponse(1L, "test-user", 300, 270, 60, 60, 90, null);

        when(service.saveTypingSession("test-user", request))
            .thenReturn(response);
        
        ResponseEntity<TypingSessionResponse> result = controller.createSession("test-user", request);

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertEquals(response, result.getBody());

        verify(service).saveTypingSession("test-user", request);
    }

    @Test
    void createSession_invalidRequest_throwsException() {
        TypingSessionRequest request = new TypingSessionRequest(-100, 50, 60);

        when(service.saveTypingSession("test-user", request))
            .thenThrow(new IllegalArgumentException());

        assertThrows(IllegalArgumentException.class, () -> controller.createSession("test-user", request));
    }

    // GET /sessions/{id}
    @Test
    void getSessionById_existingSession_returnsSession() {
        
        TypingSessionResponse response = new TypingSessionResponse(1L, "test-user", 300, 270, 60, 60, 90, null);

        when(service.getSessionById(1L))
            .thenReturn(response);
        
        ResponseEntity<TypingSessionResponse> result = controller.getSessionById(1L);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(response, result.getBody());

        verify(service).getSessionById(1L);
    }

    @Test
    void getSessionById_nonExistentSession_throwsNotFound() {

        when(service.getSessionById(1L))
        .thenThrow(new ResourceNotFoundException("not found"));

        assertThrows(ResourceNotFoundException.class, () ->
            controller.getSessionById(1L)
    );
    }

    // GET /sessions/user/{id}
    @Test
    void getAllUserSessions_returnsList() {
        List<TypingSessionResponse> sessions = List.of(
            new TypingSessionResponse(1L, "test-user", 300, 270, 60, 60, 90, null),
            new TypingSessionResponse(2L, "test-user", 250, 200, 60, 50, 80, null)
        );

        when(service.getAllSessionsForUser("test-user"))
            .thenReturn(sessions);

        ResponseEntity<List<TypingSessionResponse>> result = controller.getAllUserSessions("test-user");

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(2, result.getBody().size());

        verify(service).getAllSessionsForUser("test-user");
    }

    @Test
    void getAllUserSessions_noSessions_returnsEmptyList() {
        when(service.getAllSessionsForUser("test-user"))
            .thenReturn(List.of());

        ResponseEntity<List<TypingSessionResponse>> result = controller.getAllUserSessions("test-user");

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertTrue(result.getBody().isEmpty());
    }
}
