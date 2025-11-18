package com.example.repository;

import com.example.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    
    List<Participant> findByEventId(Long eventId);
    
    List<Participant> findByEventIdAndCheckedInFalse(Long eventId);
    
    List<Participant> findByEventIdAndCheckedInTrue(Long eventId);
    
    List<Participant> findByEventIdAndIsWalkInTrue(Long eventId);
    
    List<Participant> findByUserId(Long userId);
    
    Optional<Participant> findByUserIdAndEventId(Long userId, Long eventId);
    
    Long countByEventId(Long eventId);
    
    Long countByEventIdAndCheckedInTrue(Long eventId);
    
    Long countByUserId(Long userId);
}
