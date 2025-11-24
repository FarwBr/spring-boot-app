package com.example.controller;

import com.example.dto.CertificateValidationResponse;
import com.example.model.Event;
import com.example.model.Participant;
import com.example.repository.EventRepository;
import com.example.repository.ParticipantRepository;
import com.example.service.CertificateService;
import com.example.service.CertificateValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {
    
    @Autowired
    private CertificateValidationService certificateValidationService;
    
    @Autowired
    private CertificateService certificateService;
    
    @Autowired
    private ParticipantRepository participantRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @GetMapping("/validate/{code}")
    public ResponseEntity<CertificateValidationResponse> validateCertificate(@PathVariable String code) {
        CertificateValidationResponse response = certificateValidationService.validateCertificate(code);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/participant/{participantId}")
    public ResponseEntity<?> getParticipantCertificates(@PathVariable Long participantId) {
        return ResponseEntity.ok(certificateValidationService.getParticipantCertificates(participantId));
    }
    
    @GetMapping("/participant/{participantId}/event/{eventId}")
    public ResponseEntity<byte[]> generateCertificatePdf(
            @PathVariable Long participantId,
            @PathVariable Long eventId) {
        
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participante não encontrado"));
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        // Verificar se o participante fez check-in
        if (!participant.getCheckedIn()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Certificado disponível apenas para participantes com check-in realizado".getBytes());
        }
        
        byte[] pdfBytes = certificateService.generateCertificate(participant, event);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", 
            "certificado-" + event.getName().replaceAll("\\s+", "-") + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
