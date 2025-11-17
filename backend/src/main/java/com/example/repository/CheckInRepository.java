package com.example.repository;

import com.example.model.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    
    List<CheckIn> findByEventId(Long eventId);
    
    List<CheckIn> findByParticipantId(Long participantId);
    
    List<CheckIn> findByCheckInTimeBetween(LocalDateTime start, LocalDateTime end);
    
    List<CheckIn> findBySyncedFromOffline(Boolean synced);
}
