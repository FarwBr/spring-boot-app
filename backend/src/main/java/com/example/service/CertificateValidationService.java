package com.example.service;

import com.example.dto.CertificateValidationResponse;
import com.example.model.Certificate;
import com.example.model.Event;
import com.example.model.Participant;
import com.example.repository.CertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CertificateValidationService {
    
    @Autowired
    private CertificateRepository certificateRepository;
    
    public CertificateValidationResponse validateCertificate(String code) {
        Optional<Certificate> certificateOpt = certificateRepository.findByValidationCode(code.toUpperCase());
        
        if (certificateOpt.isEmpty()) {
            return new CertificateValidationResponse(
                false,
                "Certificado não encontrado. Código inválido.",
                null, null, null, null, null, null, code
            );
        }
        
        Certificate certificate = certificateOpt.get();
        Participant participant = certificate.getParticipant();
        Event event = certificate.getEvent();
        
        return new CertificateValidationResponse(
            true,
            "Certificado válido!",
            participant.getDisplayName(),
            event.getName(),
            event.getLocation(),
            event.getStartTime(),
            participant.getCheckInTime(),
            certificate.getIssuedAt(),
            certificate.getValidationCode()
        );
    }
    
    public List<Certificate> getParticipantCertificates(Long participantId) {
        return certificateRepository.findByParticipantId(participantId);
    }
    
    public Certificate createCertificate(Participant participant, Event event) {
        // Verificar se já existe certificado
        Optional<Certificate> existing = certificateRepository.findByParticipantIdAndEventId(
            participant.getId(), 
            event.getId()
        );
        
        if (existing.isPresent()) {
            return existing.get();
        }
        
        Certificate certificate = new Certificate();
        certificate.setParticipant(participant);
        certificate.setEvent(event);
        
        return certificateRepository.save(certificate);
    }
    
    public void markAsEmailSent(Long certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId)
            .orElseThrow(() -> new RuntimeException("Certificate not found"));
        certificate.setEmailSent(true);
        certificate.setEmailSentAt(java.time.LocalDateTime.now());
        certificateRepository.save(certificate);
    }
}
