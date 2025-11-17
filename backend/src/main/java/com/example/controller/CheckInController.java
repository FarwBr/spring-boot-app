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

@RestController
@RequestMapping("/api/checkins")
@CrossOrigin(origins = "*")
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
    
    @GetMapping("/user/{userName}")
    public ResponseEntity<List<CheckIn>> getCheckInsByUserName(@PathVariable String userName) {
        return ResponseEntity.ok(checkInService.getCheckInsByUserName(userName));
    }
    
    @GetMapping("/location/{location}")
    public ResponseEntity<List<CheckIn>> getCheckInsByLocation(@PathVariable String location) {
        return ResponseEntity.ok(checkInService.getCheckInsByLocation(location));
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
    public ResponseEntity<CheckIn> createCheckIn(@Valid @RequestBody CheckIn checkIn) {
        CheckIn savedCheckIn = checkInService.createCheckIn(checkIn);
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
