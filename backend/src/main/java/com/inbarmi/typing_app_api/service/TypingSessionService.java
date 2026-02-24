package com.inbarmi.typing_app_api.service;

import org.springframework.stereotype.Service;
import com.inbarmi.typing_app_api.entity.TypingSession;
import com.inbarmi.typing_app_api.repository.TypingSessionRepository;

@Service
public class TypingSessionService {

    private TypingSessionRepository repository;

    public TypingSession saveTypingSession(int totalTyped, int totalCorrect, int time) {
        if (totalTyped < 0 || totalCorrect < 0 || time <= 0 || totalCorrect > totalTyped) {
            throw new IllegalArgumentException("Invalid input");
        }
        TypingSession session = new TypingSession(totalTyped, totalCorrect, time);
        return repository.save(session);
    }
}
