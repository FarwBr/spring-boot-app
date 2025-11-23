package com.example.repository;

import com.example.model.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    
    Page<ActivityLog> findAllByOrderByTimestampDesc(Pageable pageable);
    
    List<ActivityLog> findByEventIdOrderByTimestampDesc(Long eventId);
    
    List<ActivityLog> findByUserIdOrderByTimestampDesc(Long userId);
    
    List<ActivityLog> findByActionOrderByTimestampDesc(String action);
    
    List<ActivityLog> findByLevelOrderByTimestampDesc(String level);
    
    List<ActivityLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime start, LocalDateTime end);
    
    Long countByAction(String action);
    
    Long countByLevel(String level);
}
