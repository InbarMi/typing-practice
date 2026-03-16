package com.inbarmi.typing_app_api.mapper;

import com.inbarmi.typing_app_api.dto.TypingSessionResponse;
import com.inbarmi.typing_app_api.entity.TypingSession;

public class TypingSessionMapper {

    public static TypingSessionResponse toResponse(TypingSession session, int wpm, int accuracy) {
        return new TypingSessionResponse(
            session.getId(),
            session.getUserId(),
            session.getTotalTyped(),
            session.getTotalCorrect(),
            session.getTimeInSeconds(),
            wpm,
            accuracy,
            session.getCreatedAt()
        );
    }
}
