package com.example.controller;

import com.example.model.ActivityLog;
import com.example.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logs")
public class ActivityLogController {
    
    @Autowired
    private ActivityLogService logService;
    
    @GetMapping
    public ResponseEntity<Page<ActivityLog>> getAllLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(logService.getAllLogs(page, size));
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<ActivityLog>> getLogsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(logService.getLogsByEvent(eventId));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ActivityLog>> getLogsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(logService.getLogsByUser(userId));
    }
    
    @GetMapping("/action/{action}")
    public ResponseEntity<List<ActivityLog>> getLogsByAction(@PathVariable String action) {
        return ResponseEntity.ok(logService.getLogsByAction(action));
    }
    
    @GetMapping("/level/{level}")
    public ResponseEntity<List<ActivityLog>> getLogsByLevel(@PathVariable String level) {
        return ResponseEntity.ok(logService.getLogsByLevel(level));
    }
    
    @GetMapping("/range")
    public ResponseEntity<List<ActivityLog>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(logService.getLogsByDateRange(start, end));
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getLogStats() {
        return ResponseEntity.ok(logService.getLogStats());
    }
}
