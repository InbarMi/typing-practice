package com.inbarmi.typing_app_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.inbarmi.typing_app_api.entity.TypingSession;
import java.util.List;


public interface TypingSessionRepository extends JpaRepository<TypingSession, Long> {

    List<TypingSession> findByUserId(String userId);
}
