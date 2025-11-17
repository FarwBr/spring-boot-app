package com.example.controller;

import com.example.model.Participant;
import com.example.service.ParticipantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/participants")
@CrossOrigin(origins = "*")
public class ParticipantController {
    
    @Autowired
    private ParticipantService participantService;
    
    @GetMapping
    public ResponseEntity<List<Participant>> getAllParticipants() {
        return ResponseEntity.ok(participantService.getAllParticipants());
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Participant>> getParticipantsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(participantService.getParticipantsByEvent(eventId));
    }
    
    @GetMapping("/event/{eventId}/pending")
    public ResponseEntity<List<Participant>> getPendingParticipants(@PathVariable Long eventId) {
        return ResponseEntity.ok(participantService.getPendingParticipants(eventId));
    }
    
    @GetMapping("/event/{eventId}/checked-in")
    public ResponseEntity<List<Participant>> getCheckedInParticipants(@PathVariable Long eventId) {
        return ResponseEntity.ok(participantService.getCheckedInParticipants(eventId));
    }
    
    @GetMapping("/event/{eventId}/walk-ins")
    public ResponseEntity<List<Participant>> getWalkInParticipants(@PathVariable Long eventId) {
        return ResponseEntity.ok(participantService.getWalkInParticipants(eventId));
    }
    
    @GetMapping("/event/{eventId}/stats")
    public ResponseEntity<Map<String, Long>> getEventStats(@PathVariable Long eventId) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", participantService.getParticipantCount(eventId));
        stats.put("checkedIn", participantService.getCheckedInCount(eventId));
        stats.put("pending", stats.get("total") - stats.get("checkedIn"));
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Participant> getParticipantById(@PathVariable Long id) {
        return participantService.getParticipantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/event/{eventId}")
    public ResponseEntity<Participant> createParticipant(
            @PathVariable Long eventId, 
            @Valid @RequestBody Participant participant) {
        Participant savedParticipant = participantService.createParticipant(eventId, participant);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedParticipant);
    }
    
    @PostMapping("/event/{eventId}/walk-in")
    public ResponseEntity<Participant> createWalkIn(
            @PathVariable Long eventId, 
            @Valid @RequestBody Participant participant) {
        Participant walkIn = participantService.createWalkIn(eventId, participant);
        return ResponseEntity.status(HttpStatus.CREATED).body(walkIn);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Participant> updateParticipant(
            @PathVariable Long id, 
            @Valid @RequestBody Participant participantDetails) {
        Participant updatedParticipant = participantService.updateParticipant(id, participantDetails);
        return ResponseEntity.ok(updatedParticipant);
    }
    
    @PatchMapping("/{id}/checkin")
    public ResponseEntity<Participant> checkInParticipant(@PathVariable Long id) {
        Participant participant = participantService.checkInParticipant(id);
        return ResponseEntity.ok(participant);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParticipant(@PathVariable Long id) {
        participantService.deleteParticipant(id);
        return ResponseEntity.noContent().build();
    }
}
