package com.inbarmi.typing_app_api.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.inbarmi.typing_app_api.entity.TypingSession;
import com.inbarmi.typing_app_api.mapper.TypingSessionMapper;
import com.inbarmi.typing_app_api.repository.TypingSessionRepository;
import com.inbarmi.typing_app_api.dto.*;
import com.inbarmi.typing_app_api.exception.*;

@Service
public class TypingSessionService {

    private TypingSessionRepository repository;

    public TypingSessionService(TypingSessionRepository repo) {
        this.repository = repo;
    }

    public TypingSessionResponse saveTypingSession(String userId, TypingSessionRequest request) {
        int totalTyped = request.getTotalTyped();
        int totalCorrect = request.getTotalCorrect();
        int time = request.getTimeInSeconds();

        if (totalTyped < 0 || totalCorrect < 0 || time <= 0 || totalCorrect > totalTyped) {
            throw new IllegalArgumentException("Invalid input");
        }
        TypingSession session = new TypingSession(totalTyped, totalCorrect, time, userId);
        TypingSession saved = repository.save(session);

        return mapSession(saved);
    }

    public TypingSessionResponse getSessionById(Long sessionId) {
        TypingSession session = repository.findById(sessionId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Session does not exist with id: " + sessionId));

        return mapSession(session);
    }

    public List<TypingSessionResponse> getAllSessionsForUser(String userId) {
        List<TypingSession> sessions = repository.findByUserId(userId);

        return sessions.stream()
            .map(this::mapSession)
            .toList();
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

    private TypingSessionResponse mapSession(TypingSession session) {
        int wpm = calcWpm(session.getTotalTyped(), session.getTimeInSeconds());
        int accuracy = calcAccuracy(session.getTotalCorrect(), session.getTotalTyped());

        return TypingSessionMapper.toResponse(session, wpm, accuracy);
    }
}
