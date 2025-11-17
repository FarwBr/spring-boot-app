package com.example.repository;

import com.example.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    
    List<Participant> findByEventId(Long eventId);
    
    List<Participant> findByEventIdAndCheckedInFalse(Long eventId);
    
    List<Participant> findByEventIdAndCheckedInTrue(Long eventId);
    
    List<Participant> findByEventIdAndIsWalkInTrue(Long eventId);
    
    Long countByEventId(Long eventId);
    
    Long countByEventIdAndCheckedInTrue(Long eventId);
}
