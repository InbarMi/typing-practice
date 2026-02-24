package com.inbarmi.typing_app_api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "typing_sessions")
public class TypingSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_typed")
    private int totalTyped;

    @Column(name = "total_correct")
    private int totalCorrect;

    @Column(name = "time_in_seconds")
    private int timeInSeconds;

    @Column(name = "created_at")
    @CreationTimestamp
    private Instant createdAt;

    public TypingSession(int totalTyped, int totalCorrect, int timeInSeconds) {
        this.totalTyped = totalTyped;
        this.totalCorrect = totalCorrect;
        this.timeInSeconds = timeInSeconds;
    }
}