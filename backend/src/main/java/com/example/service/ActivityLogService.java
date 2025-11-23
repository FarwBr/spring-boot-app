package com.example.service;

import com.example.model.ActivityLog;
import com.example.model.Event;
import com.example.model.User;
import com.example.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ActivityLogService {
    
    @Autowired
    private ActivityLogRepository logRepository;
    
    // Criar log
    public ActivityLog createLog(String action, String entity, Long entityId, User user, Event event, String details, String level) {
        ActivityLog log = new ActivityLog();
        log.setAction(action);
        log.setEntity(entity);
        log.setEntityId(entityId);
        log.setUser(user);
        log.setEvent(event);
        log.setDetails(details);
        log.setLevel(level);
        log.setTimestamp(LocalDateTime.now());
        
        return logRepository.save(log);
    }
    
    // Logs simplificados
    public void logInfo(String action, String entity, Long entityId, User user) {
        createLog(action, entity, entityId, user, null, null, "INFO");
    }
    
    public void logSuccess(String action, String entity, Long entityId, User user, Event event, String details) {
        createLog(action, entity, entityId, user, event, details, "SUCCESS");
    }
    
    public void logWarning(String action, String entity, Long entityId, String details) {
        createLog(action, entity, entityId, null, null, details, "WARNING");
    }
    
    public void logError(String action, String entity, String details) {
        createLog(action, entity, null, null, null, details, "ERROR");
    }
    
    // Buscar logs
    public Page<ActivityLog> getAllLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return logRepository.findAllByOrderByTimestampDesc(pageable);
    }
    
    public List<ActivityLog> getLogsByEvent(Long eventId) {
        return logRepository.findByEventIdOrderByTimestampDesc(eventId);
    }
    
    public List<ActivityLog> getLogsByUser(Long userId) {
        return logRepository.findByUserIdOrderByTimestampDesc(userId);
    }
    
    public List<ActivityLog> getLogsByAction(String action) {
        return logRepository.findByActionOrderByTimestampDesc(action);
    }
    
    public List<ActivityLog> getLogsByLevel(String level) {
        return logRepository.findByLevelOrderByTimestampDesc(level);
    }
    
    public List<ActivityLog> getLogsByDateRange(LocalDateTime start, LocalDateTime end) {
        return logRepository.findByTimestampBetweenOrderByTimestampDesc(start, end);
    }
    
    // Estatísticas
    public Map<String, Object> getLogStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("total", logRepository.count());
        stats.put("checkIns", logRepository.countByAction("CHECK_IN"));
        stats.put("participantsCreated", logRepository.countByAction("PARTICIPANT_CREATED"));
        stats.put("eventsCreated", logRepository.countByAction("EVENT_CREATED"));
        stats.put("errors", logRepository.countByLevel("ERROR"));
        stats.put("warnings", logRepository.countByLevel("WARNING"));
        stats.put("success", logRepository.countByLevel("SUCCESS"));
        
        return stats;
    }
}
