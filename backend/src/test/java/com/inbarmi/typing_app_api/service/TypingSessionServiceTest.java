package com.inbarmi.typing_app_api.service;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import com.inbarmi.typing_app_api.entity.TypingSession;
import com.inbarmi.typing_app_api.repository.TypingSessionRepository;
import com.inbarmi.typing_app_api.dto.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.Mockito;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TypingSessionServiceTest {

    @Mock
    private TypingSessionRepository repository;

    @InjectMocks
    private TypingSessionService service;

    @Test
    void shouldRejectNegativeTotalTyped() {
        TypingSessionRequest dto = new TypingSessionRequest(-100, 50, 60);

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingSession("test-user", dto)
        );
    }

    @Test
    void shouldRejectNegativeTotalCorrect() {
        TypingSessionRequest dto = new TypingSessionRequest(100, -50, 60);

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingSession("test-user", dto)
        );
    }

    @Test
    void shouldRejectZeroTime() {
        TypingSessionRequest dto = new TypingSessionRequest(150, 125, 0);

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingSession("test-user", dto)
        );
    }

    @Test
    void shouldRejectNegativeTime() {
        TypingSessionRequest dto = new TypingSessionRequest(150, 125, -60);

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingSession("test-user", dto)
        );
    }

    @Test
    void shouldRejectTotalCorrectExceedsTotalTyped() {
        TypingSessionRequest dto = new TypingSessionRequest(100, 150, 60);

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingSession("test-user", dto)
        );
    }

    @Test
    void saveTypingSessionShouldReturnDtoWithStats() {
        TypingSessionRequest request = new TypingSessionRequest(300, 270, 60);

        TypingSession mockSession = new TypingSession(300, 270, 60, "test-user");

        when(repository.save(Mockito.any()))
            .thenReturn(mockSession);
        
        TypingSessionResponse result = service.saveTypingSession("test-user", request);

        assertEquals(300, result.getTotalTyped());
        assertEquals(270, result.getTotalCorrect());
        assertEquals(60, result.getTimeInSeconds());
        assertEquals("test-user", result.getUserId());
        assertEquals(60, result.getWpm());
        assertEquals(90, result.getAccuracy());
    }

    @Test
    void saveTypingSessionWithNothingTypedReturnsZeroStats() {
        TypingSessionRequest request = new TypingSessionRequest(0, 0, 60);

        TypingSession mockSession = new TypingSession(0, 0, 60, "test-user");

        when(repository.save(Mockito.any()))
            .thenReturn(mockSession);
        
        TypingSessionResponse result = service.saveTypingSession("test-user", request);

        assertEquals(0, result.getWpm());
        assertEquals(0, result.getAccuracy());
    }

    // @Test
    // void validInputReturnsCorrectWpm() {
    //     // (totalTyped / 5) / (time / 60)
    //     // expected 60 wpm
    //     int totalTyped = 300;
    //     int time = 60;
    //     int totalCorrect = 250;

    //     TypingSession mockSession = new TypingSession(totalTyped, totalCorrect, time, "test-user");

    //     when(repository.getReferenceById(1L))
    //         .thenReturn(mockSession);

    //     int wpm = service.getSessionWpm(1L);
        
    //     assertEquals(60, wpm);
    // }
    // @Test
    // void validInputReturnsRoundedWpm() {
    //     // (totalTyped / 5) / (time / 60)
    //     // expected 56 wpm (round 55.6)
    //     int totalTyped = 278;
    //     int time = 60;
    //     int totalCorrect = 250;

    //     TypingSession mockSession = new TypingSession(totalTyped, totalCorrect, time, "test-user");

    //     when(repository.getReferenceById(1L))
    //         .thenReturn(mockSession);

    //     int wpm = service.getSessionWpm(1L);
        
    //     assertEquals(56, wpm);
    // }

    // @Test
    // void nothingTypedShouldReturnZeroWpm() {
    //     int totalTyped = 0;
    //     int totalCorrect = 0;
    //     int time = 60;

    //     TypingSession mockSession = new TypingSession(totalTyped, totalCorrect, time, "test-user");

    //     when(repository.getReferenceById(1L))
    //         .thenReturn(mockSession);

    //     int wpm = service.getSessionWpm(1L);
        
    //     assertEquals(0, wpm);
    // }


    // @Test
    // void validInputReturnsCorrectAccuracy() {
    //     // (totalCorrect / totalTyped) * 100
    //     // expected 83%
    //     int totalTyped = 300;
    //     int time = 60;
    //     int totalCorrect = 250;

    //     TypingSession mockSession = new TypingSession(totalTyped, totalCorrect, time, "test-user");

    //     when(repository.getReferenceById(1L))
    //         .thenReturn(mockSession);

    //     int accuracy = service.getSessionAccuracy(1L);
        
    //     assertEquals(83, accuracy);
    // }

    // @Test
    // void validInputReturnsRoundedAccuracy() {
    //     // (totalCorrect / totalTyped) * 100
    //     // expected 92% (round 91.6)
    //     int totalTyped = 300;
    //     int time = 60;
    //     int totalCorrect = 275;

    //     TypingSession mockSession = new TypingSession(totalTyped, totalCorrect, time, "test-user");

    //     when(repository.getReferenceById(1L))
    //         .thenReturn(mockSession);

    //     int accuracy = service.getSessionAccuracy(1L);
        
    //     assertEquals(92, accuracy);
    // }

    // @Test
    // void nothingTypedShouldReturnZeroAccuracy() {
    //     int totalTyped = 0;
    //     int totalCorrect = 0;
    //     int time = 60;

    //     TypingSession mockSession = new TypingSession(totalTyped, totalCorrect, time, "test-user");

    //     when(repository.getReferenceById(1L))
    //         .thenReturn(mockSession);

    //     int accuracy = service.getSessionAccuracy(1L);
        
    //     assertEquals(0, accuracy);
    // }
}