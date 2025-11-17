package com.example.repository;

import com.example.model.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    
    List<CheckIn> findByUserNameOrderByCheckInTimeDesc(String userName);
    
    List<CheckIn> findByLocationOrderByCheckInTimeDesc(String location);
    
    List<CheckIn> findByCheckInTimeBetween(LocalDateTime start, LocalDateTime end);
    
    List<CheckIn> findBySyncedFromOffline(Boolean synced);
}
