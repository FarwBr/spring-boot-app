package com.example.controller;

import com.example.model.CheckIn;
import com.example.service.CheckInService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/checkins")
public class CheckInController {
    
    @Autowired
    private CheckInService checkInService;
    
    @GetMapping
    public ResponseEntity<List<CheckIn>> getAllCheckIns() {
        return ResponseEntity.ok(checkInService.getAllCheckIns());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CheckIn> getCheckInById(@PathVariable Long id) {
        return checkInService.getCheckInById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/range")
    public ResponseEntity<List<CheckIn>> getCheckInsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(checkInService.getCheckInsByDateRange(start, end));
    }
    
    @GetMapping("/offline-synced")
    public ResponseEntity<List<CheckIn>> getOfflineSyncedCheckIns() {
        return ResponseEntity.ok(checkInService.getOfflineSyncedCheckIns());
    }
    
    @PostMapping
    public ResponseEntity<CheckIn> createCheckIn(
            @RequestParam Long eventId,
            @RequestParam Long participantId,
            @Valid @RequestBody CheckIn checkIn) {
        CheckIn savedCheckIn = checkInService.createCheckIn(eventId, participantId, checkIn);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCheckIn);
    }
    
    @PostMapping("/sync")
    public ResponseEntity<List<CheckIn>> syncOfflineCheckIns(@Valid @RequestBody List<CheckIn> offlineCheckIns) {
        List<CheckIn> syncedCheckIns = checkInService.syncOfflineCheckIns(offlineCheckIns);
        return ResponseEntity.status(HttpStatus.CREATED).body(syncedCheckIns);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CheckIn> updateCheckIn(@PathVariable Long id, @Valid @RequestBody CheckIn checkInDetails) {
        CheckIn updatedCheckIn = checkInService.updateCheckIn(id, checkInDetails);
        return ResponseEntity.ok(updatedCheckIn);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCheckIn(@PathVariable Long id) {
        checkInService.deleteCheckIn(id);
        return ResponseEntity.noContent().build();
    }
}
