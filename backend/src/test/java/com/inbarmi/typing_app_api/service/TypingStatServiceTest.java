package com.inbarmi.typing_app_api.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertThrows;

class TypingStatServiceTest {

    @Test
    void shouldRejectNegativeTotalTyped() {
        TypingStatService service = new TypingStatService();
        int totalTyped = -100;
        int totalCorrect = 50;
        int time = 60;

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingStat(totalTyped, totalCorrect, time)
        );
    }

    @Test
    void shouldRejectNegativeTotalCorrect() {
        TypingStatService service = new TypingStatService();
        int totalTyped = 100;
        int totalCorrect = -50;
        int time = 60;

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingStat(totalTyped, totalCorrect, time)
        );
    }

    @Test
    void shouldRejectZeroTime() {
        TypingStatService service = new TypingStatService();
        int totalTyped = 150;
        int totalCorrect = 125;
        int time = 0;

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingStat(totalTyped, totalCorrect, time)
        );
    }

    @Test
    void shouldRejectNegativeTime() {
        TypingStatService service = new TypingStatService();
        int totalTyped = 150;
        int totalCorrect = 125;
        int time = -60;

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingStat(totalTyped, totalCorrect, time)
        );
    }

    @Test
    void shouldRejectTotalCorrectExceedsTotalTyped() {
        TypingStatService service = new TypingStatService();
        int totalTyped = 100;
        int totalCorrect = 150;
        int time = 60;

        assertThrows(IllegalArgumentException.class, () ->
            service.saveTypingStat(totalTyped, totalCorrect, time)
        );
    }
}