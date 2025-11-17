package com.example.service;

import com.example.model.Event;
import com.example.model.Participant;
import com.example.repository.EventRepository;
import com.example.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ParticipantService {
    
    @Autowired
    private ParticipantRepository participantRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }
    
    public List<Participant> getParticipantsByEvent(Long eventId) {
        return participantRepository.findByEventId(eventId);
    }
    
    public List<Participant> getPendingParticipants(Long eventId) {
        return participantRepository.findByEventIdAndCheckedInFalse(eventId);
    }
    
    public List<Participant> getCheckedInParticipants(Long eventId) {
        return participantRepository.findByEventIdAndCheckedInTrue(eventId);
    }
    
    public List<Participant> getWalkInParticipants(Long eventId) {
        return participantRepository.findByEventIdAndIsWalkInTrue(eventId);
    }
    
    public Optional<Participant> getParticipantById(Long id) {
        return participantRepository.findById(id);
    }
    
    public Participant createParticipant(Long eventId, Participant participant) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        participant.setEvent(event);
        return participantRepository.save(participant);
    }
    
    public Participant createWalkIn(Long eventId, Participant participant) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        participant.setEvent(event);
        participant.setIsWalkIn(true);
        return participantRepository.save(participant);
    }
    
    public Participant updateParticipant(Long id, Participant participantDetails) {
        Participant participant = participantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participant not found with id: " + id));
        
        participant.setName(participantDetails.getName());
        participant.setEmail(participantDetails.getEmail());
        participant.setPhone(participantDetails.getPhone());
        participant.setCompany(participantDetails.getCompany());
        
        return participantRepository.save(participant);
    }
    
    public Participant checkInParticipant(Long id) {
        Participant participant = participantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participant not found with id: " + id));
        
        participant.setCheckedIn(true);
        participant.setCheckInTime(LocalDateTime.now());
        
        return participantRepository.save(participant);
    }
    
    public void deleteParticipant(Long id) {
        Participant participant = participantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participant not found with id: " + id));
        participantRepository.delete(participant);
    }
    
    public Long getParticipantCount(Long eventId) {
        return participantRepository.countByEventId(eventId);
    }
    
    public Long getCheckedInCount(Long eventId) {
        return participantRepository.countByEventIdAndCheckedInTrue(eventId);
    }
}
