package com.inbarmi.typing_app_api.service;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import com.inbarmi.typing_app_api.entity.TypingSession;
import com.inbarmi.typing_app_api.repository.TypingSessionRepository;
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
        int totalTyped = -100;
        int totalCorrect = 50;
        int time = 60;

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingSession(totalTyped, totalCorrect, time)
        );
    }

    @Test
    void shouldRejectNegativeTotalCorrect() {
        int totalTyped = 100;
        int totalCorrect = -50;
        int time = 60;

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingSession(totalTyped, totalCorrect, time)
        );
    }

    @Test
    void shouldRejectZeroTime() {
        int totalTyped = 150;
        int totalCorrect = 125;
        int time = 0;

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingSession(totalTyped, totalCorrect, time)
        );
    }

    @Test
    void shouldRejectNegativeTime() {
        int totalTyped = 150;
        int totalCorrect = 125;
        int time = -60;

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingSession(totalTyped, totalCorrect, time)
        );
    }

    @Test
    void shouldRejectTotalCorrectExceedsTotalTyped() {
        int totalTyped = 100;
        int totalCorrect = 150;
        int time = 60;

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingSession(totalTyped, totalCorrect, time)
        );
    }

    @Test
    void saveTypingSessionShouldReturnSessionForValidInputs() {
        int totalTyped = 300;
        int totalCorrect = 270;
        int time = 60;

        TypingSession mockSession = new TypingSession(totalTyped, totalCorrect, time);

        when(repository.save(Mockito.any()))
            .thenReturn(mockSession);
        
        TypingSession result = service.saveTypingSession(totalTyped, totalCorrect, time);

        assertEquals(totalTyped, result.getTotalTyped());
        assertEquals(totalCorrect, result.getTotalCorrect());
        assertEquals(time, result.getTimeInSeconds());
    }

    @Test
    void validInputReturnsCorrectWpm() {
        // (totalTyped / 5) / (time / 60)
        // expected 60 wpm
        int totalTyped = 300;
        int time = 60;
        int totalCorrect = 250;

        TypingSession mockSession = new TypingSession(totalTyped, totalCorrect, time);

        when(repository.save(any()))
            .thenReturn(mockSession);

        TypingSession result = service.saveTypingSession(totalTyped, totalCorrect, time);

        int wpm = service.getSessionWpm(result.getId());
        
        assertEquals(60, wpm);
    }

    @Test
    void validInputReturnsCorrectAccuracy() {
        // (totalCorrect / totalTyped) * 100
        // expected 83%
        int totalTyped = 300;
        int time = 60;
        int totalCorrect = 250;

        TypingSession mockSession = new TypingSession(totalTyped, totalCorrect, time);

        when(repository.save(any()))
            .thenReturn(mockSession);

        TypingSession result = service.saveTypingSession(totalTyped, totalCorrect, time);

        int accuracy = service.getSessionAccuracy(result.getId());
        
        assertEquals(83, accuracy);
    }

    @Test
    void nothingTypedShouldReturnZeroWpm() {
        int totalTyped = 0;
        int totalCorrect = 0;
        int time = 60;

        TypingSession mockSession = new TypingSession(totalTyped, totalCorrect, time);

        when(repository.save(any()))
            .thenReturn(mockSession);

        TypingSession result = service.saveTypingSession(totalTyped, totalCorrect, time);

        int wpm = service.getSessionWpm(result.getId());
        
        assertEquals(0, wpm);
    }

    @Test
    void nothingTypedShouldReturnZeroAccuracy() {
        int totalTyped = 0;
        int totalCorrect = 0;
        int time = 60;

        TypingSession mockSession = new TypingSession(totalTyped, totalCorrect, time);

        when(repository.save(any()))
            .thenReturn(mockSession);

        TypingSession result = service.saveTypingSession(totalTyped, totalCorrect, time);

        int accuracy = service.getSessionAccuracy(result.getId());
        
        assertEquals(0, accuracy);
    }
}