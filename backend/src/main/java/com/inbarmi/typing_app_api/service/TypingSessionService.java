package com.inbarmi.typing_app_api.service;

import org.springframework.stereotype.Service;
import com.inbarmi.typing_app_api.entity.TypingSession;
import com.inbarmi.typing_app_api.repository.TypingSessionRepository;

@Service
public class TypingSessionService {

    private TypingSessionRepository repository;

    public TypingSessionService(TypingSessionRepository repo) {
        this.repository = repo;
    }

    public TypingSession saveTypingSession(int totalTyped, int totalCorrect, int time) {
        if (totalTyped < 0 || totalCorrect < 0 || time <= 0 || totalCorrect > totalTyped) {
            throw new IllegalArgumentException("Invalid input");
        }
        TypingSession session = new TypingSession(totalTyped, totalCorrect, time);
        return repository.save(session);
    }

    public int getSessionWpm(Long sessionId) {
        if (sessionId == null) {
            throw new IllegalArgumentException("Invalid session Id");
        }

        TypingSession session = repository.getReferenceById(sessionId);
        
        return calcWpm(session.getTotalTyped(), session.getTimeInSeconds());
    }

    public int getSessionAccuracy(Long sessionId) {
        if (sessionId == null) {
            throw new IllegalArgumentException("Invalid session Id");
        }

        TypingSession session = repository.getReferenceById(sessionId);
        
        return calcAccuracy(session.getTotalCorrect(), session.getTotalTyped());
    }

    private int calcWpm(int totalTyped, int time) {
        if (totalTyped == 0) {
            return 0;
        }

        float words = totalTyped / 5.0f;
        float minutes = time / 60.0f;

        return Math.round(words / minutes); // assume average word length of 5 characters
    }

    private int calcAccuracy(int totalCorrect, int totalTyped) {
        if (totalTyped == 0) {
            return 0;
        }

        return Math.round((totalCorrect * 100.0f) / totalTyped);
    }
}
