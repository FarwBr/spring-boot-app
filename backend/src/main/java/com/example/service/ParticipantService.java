package com.example.service;

import com.example.exception.BadRequestException;
import com.example.exception.ResourceNotFoundException;
import com.example.model.Event;
import com.example.model.Participant;
import com.example.model.User;
import com.example.repository.EventRepository;
import com.example.repository.ParticipantRepository;
import com.example.repository.UserRepository;
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
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CertificateService certificateService;
    
    @Autowired
    private EmailService emailService;
    
    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }
    
    public List<Participant> getParticipantsByEvent(Long eventId) {
        return participantRepository.findByEventId(eventId);
    }
    
    public List<Participant> getParticipantsByUser(Long userId) {
        return participantRepository.findByUserId(userId);
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
    
    // Usuário registrado se inscrevendo em evento
    public Participant registerUserToEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        
        // Verificar se já está inscrito
        Optional<Participant> existing = participantRepository.findByUserIdAndEventId(userId, eventId);
        if (existing.isPresent()) {
            throw new BadRequestException("User already registered for this event");
        }
        
        // Verificar capacidade do evento
        Long currentCount = participantRepository.countByEventId(eventId);
        if (event.getMaxCapacity() > 0 && currentCount >= event.getMaxCapacity()) {
            throw new BadRequestException("Event is at maximum capacity");
        }
        
        Participant participant = new Participant();
        participant.setUser(user);
        participant.setEvent(event);
        participant.setIsWalkIn(false);
        
        return participantRepository.save(participant);
    }
    
    public Participant createParticipant(Long eventId, Participant participant) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        
        participant.setEvent(event);
        return participantRepository.save(participant);
    }
    
    public Participant createWalkIn(Long eventId, Participant participant) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        
        participant.setEvent(event);
        participant.setIsWalkIn(true);
        return participantRepository.save(participant);
    }
    
    public Participant updateParticipant(Long id, Participant participantDetails) {
        Participant participant = participantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Participant", "id", id));
        
        participant.setName(participantDetails.getName());
        participant.setEmail(participantDetails.getEmail());
        participant.setPhone(participantDetails.getPhone());
        participant.setCompany(participantDetails.getCompany());
        
        return participantRepository.save(participant);
    }
    
    public Participant checkInParticipant(Long id) {
        Participant participant = participantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Participant", "id", id));
        
        if (participant.getCheckedIn()) {
            throw new BadRequestException("Participant already checked in");
        }
        
        participant.setCheckedIn(true);
        participant.setCheckInTime(LocalDateTime.now());
        
        Participant saved = participantRepository.save(participant);
        
        // Enviar certificado por email de forma assíncrona (não bloqueia o check-in)
        try {
            sendCertificateAsync(saved);
        } catch (Exception e) {
            // Log erro mas não falha o check-in
            System.err.println("Erro ao enviar certificado: " + e.getMessage());
        }
        
        return saved;
    }
    
    private void sendCertificateAsync(Participant participant) {
        new Thread(() -> {
            try {
                Event event = participant.getEvent();
                String email = participant.getDisplayEmail();
                
                if (email != null && !email.isEmpty()) {
                    // Gerar PDF
                    byte[] certificatePdf = certificateService.generateCertificate(participant, event);
                    
                    // Enviar email
                    emailService.sendCertificateEmail(
                        email,
                        participant.getDisplayName(),
                        event.getName(),
                        certificatePdf
                    );
                    
                    System.out.println("✅ Certificado enviado para: " + email);
                }
            } catch (Exception e) {
                System.err.println("❌ Erro ao enviar certificado: " + e.getMessage());
            }
        }).start();
    }
    
    public void sendCertificateToParticipant(Long participantId) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant", "id", participantId));
        
        if (!participant.getCheckedIn()) {
            throw new BadRequestException("Participant must be checked in to receive certificate");
        }
        
        String email = participant.getDisplayEmail();
        if (email == null || email.isEmpty()) {
            throw new BadRequestException("Participant has no email address");
        }
        
        Event event = participant.getEvent();
        
        // Gerar PDF
        byte[] certificatePdf = certificateService.generateCertificate(participant, event);
        
        // Enviar email
        emailService.sendCertificateEmail(
            email,
            participant.getDisplayName(),
            event.getName(),
            certificatePdf
        );
    }
    
    public void deleteParticipant(Long id) {
        Participant participant = participantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Participant", "id", id));
        participantRepository.delete(participant);
    }
    
    public Long getParticipantCount(Long eventId) {
        return participantRepository.countByEventId(eventId);
    }
    
    public Long getCheckedInCount(Long eventId) {
        return participantRepository.countByEventIdAndCheckedInTrue(eventId);
    }
    
    public Long getUserEventsCount(Long userId) {
        return participantRepository.countByUserId(userId);
    }
}
