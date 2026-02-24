package com.inbarmi.typing_app_api.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.inbarmi.typing_app_api.entity.TypingSession;

class TypingSessionServiceTest {

    @Test
    void shouldRejectNegativeTotalTyped() {
        TypingSessionService service = new TypingSessionService();
        int totalTyped = -100;
        int totalCorrect = 50;
        int time = 60;

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingSession(totalTyped, totalCorrect, time)
        );
    }

    @Test
    void shouldRejectNegativeTotalCorrect() {
        TypingSessionService service = new TypingSessionService();
        int totalTyped = 100;
        int totalCorrect = -50;
        int time = 60;

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingSession(totalTyped, totalCorrect, time)
        );
    }

    @Test
    void shouldRejectZeroTime() {
        TypingSessionService service = new TypingSessionService();
        int totalTyped = 150;
        int totalCorrect = 125;
        int time = 0;

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingSession(totalTyped, totalCorrect, time)
        );
    }

    @Test
    void shouldRejectNegativeTime() {
        TypingSessionService service = new TypingSessionService();
        int totalTyped = 150;
        int totalCorrect = 125;
        int time = -60;

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingSession(totalTyped, totalCorrect, time)
        );
    }

    @Test
    void shouldRejectTotalCorrectExceedsTotalTyped() {
        TypingSessionService service = new TypingSessionService();
        int totalTyped = 100;
        int totalCorrect = 150;
        int time = 60;

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingSession(totalTyped, totalCorrect, time)
        );
    }

    @Test
    void saveTypingSessionShouldReturnSessionForValidInputs() {
        TypingSessionService service = new TypingSessionService();
        int totalTyped = 300;
        int totalCorrect = 270;
        int time = 60;

        TypingSession result = service.saveTypingSession(totalTyped, totalCorrect, time);

        assertEquals(totalTyped, result.getTotalTyped());
        assertEquals(totalCorrect, result.getTotalCorrect());
        assertEquals(time, result.getTimeInSeconds());
    }
}