package com.example.repository;

import com.example.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findByActiveTrue();
    
    List<Event> findByActiveTrueOrderByStartTimeAsc();
    
    @Query("SELECT e FROM Event e WHERE e.active = true AND e.startTime <= :now AND e.endTime >= :now")
    List<Event> findActiveEventsNow(LocalDateTime now);
    
    List<Event> findByLocationOrderByStartTimeDesc(String location);
    
    List<Event> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
}
