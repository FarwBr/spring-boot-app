package com.example.service;

import com.example.model.CheckIn;
import com.example.model.Event;
import com.example.model.Participant;
import com.example.repository.CheckInRepository;
import com.example.repository.EventRepository;
import com.example.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CheckInService {
    
    @Autowired
    private CheckInRepository checkInRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private ParticipantRepository participantRepository;
    
    @Autowired
    private ParticipantService participantService;
    
    public List<CheckIn> getAllCheckIns() {
        return checkInRepository.findAll();
    }
    
    public Optional<CheckIn> getCheckInById(Long id) {
        return checkInRepository.findById(id);
    }
    
    public List<CheckIn> getCheckInsByDateRange(LocalDateTime start, LocalDateTime end) {
        return checkInRepository.findByCheckInTimeBetween(start, end);
    }
    
    public List<CheckIn> getOfflineSyncedCheckIns() {
        return checkInRepository.findBySyncedFromOffline(true);
    }
    
    public CheckIn createCheckIn(Long eventId, Long participantId, CheckIn checkIn) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found with id: " + participantId));
        
        checkIn.setEvent(event);
        checkIn.setParticipant(participant);
        
        if (checkIn.getCheckInTime() == null) {
            checkIn.setCheckInTime(LocalDateTime.now());
        }
        
        // Atualizar status do participante
        participantService.checkInParticipant(participantId);
        
        return checkInRepository.save(checkIn);
    }
    
    public CheckIn updateCheckIn(Long id, CheckIn checkInDetails) {
        CheckIn checkIn = checkInRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CheckIn not found with id: " + id));
        
        checkIn.setNotes(checkInDetails.getNotes());
        checkIn.setCheckInTime(checkInDetails.getCheckInTime());
        
        return checkInRepository.save(checkIn);
    }
    
    public void deleteCheckIn(Long id) {
        CheckIn checkIn = checkInRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CheckIn not found with id: " + id));
        checkInRepository.delete(checkIn);
    }
    
    public List<CheckIn> syncOfflineCheckIns(List<CheckIn> offlineCheckIns) {
        offlineCheckIns.forEach(checkIn -> {
            checkIn.setSyncedFromOffline(true);
        });
        return checkInRepository.saveAll(offlineCheckIns);
    }
}
