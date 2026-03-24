package com.inbarmi.typing_app_api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TypingSessionRequest {

    private int totalTyped;
    private int totalCorrect;
    private int timeInSeconds;
}
