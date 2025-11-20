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
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private ParticipantRepository participantRepository;
    
    @Autowired
    private CertificateService certificateService;
    
    @Autowired
    private EmailService emailService;
    
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    public List<Event> getActiveEvents() {
        return eventRepository.findByActiveTrueOrderByStartTimeAsc();
    }
    
    public List<Event> getCurrentlyActiveEvents() {
        return eventRepository.findActiveEventsNow(LocalDateTime.now());
    }
    
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }
    
    public List<Event> getEventsByLocation(String location) {
        return eventRepository.findByLocationOrderByStartTimeDesc(location);
    }
    
    public List<Event> getEventsByDateRange(LocalDateTime start, LocalDateTime end) {
        return eventRepository.findByStartTimeBetween(start, end);
    }
    
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }
    
    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        
        event.setName(eventDetails.getName());
        event.setDescription(eventDetails.getDescription());
        event.setLocation(eventDetails.getLocation());
        event.setStartTime(eventDetails.getStartTime());
        event.setEndTime(eventDetails.getEndTime());
        event.setActive(eventDetails.getActive());
        event.setMaxCapacity(eventDetails.getMaxCapacity());
        
        return eventRepository.save(event);
    }
    
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        eventRepository.delete(event);
    }
    
    public Event toggleEventActive(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        event.setActive(!event.getActive());
        return eventRepository.save(event);
    }
    
    public Event finishEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        
        if (event.getFinished()) {
            throw new RuntimeException("Event is already finished");
        }
        
        // Marcar evento como finalizado
        event.setFinished(true);
        event.setActive(false);
        event = eventRepository.save(event);
        
        // Gerar e enviar certificados para participantes com check-in
        generateCertificatesForEvent(event);
        
        return event;
    }
    
    private void generateCertificatesForEvent(Event event) {
        // Buscar participantes que fizeram check-in
        List<Participant> checkedInParticipants = participantRepository.findByEventIdAndCheckedInTrue(event.getId());
        
        System.out.println("📜 Gerando certificados para " + checkedInParticipants.size() + " participantes do evento: " + event.getName());
        
        // Gerar e enviar certificados em thread separada para não bloquear
        new Thread(() -> {
            int sent = 0;
            int failed = 0;
            
            for (Participant participant : checkedInParticipants) {
                try {
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
                        
                        sent++;
                        System.out.println("✅ Certificado enviado para: " + email);
                    } else {
                        System.out.println("⚠️ Participante sem email: " + participant.getDisplayName());
                    }
                } catch (Exception e) {
                    failed++;
                    System.err.println("❌ Erro ao enviar certificado para " + participant.getDisplayName() + ": " + e.getMessage());
                }
            }
            
            System.out.println("📊 Resumo: " + sent + " enviados, " + failed + " falharam");
        }).start();
    }
}
