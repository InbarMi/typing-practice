package com.inbarmi.typing_app_api.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TypingSessionResponse {
    private Long id;
    private String userId;
    private int totalTyped;
    private int totalCorrect;
    private int timeInSeconds;
    private int wpm;
    private int accuracy;
    private Instant createdAt;

}
