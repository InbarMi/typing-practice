package com.inbarmi.typing_app_api.entity;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "typingSessions")
public class TypingSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "total_typed")
    private int totalTyped;

    @Column(name = "total_correct")
    private int totalCorrect;

    @Column(name = "time_in_seconds")
    private int timeInSeconds;

    @Column(name = "created_at")
    private Instant createdAt;
}