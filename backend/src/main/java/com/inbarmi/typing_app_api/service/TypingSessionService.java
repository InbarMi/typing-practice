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
        return -1;
    }

    public int getSessionAccuracy(Long sessionId) {
        return -1;
    }

}
