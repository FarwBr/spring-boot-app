package com.example.controller;

import com.example.dto.CertificateValidationResponse;
import com.example.model.Certificate;
import com.example.service.CertificateValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {
    
    @Autowired
    private CertificateValidationService certificateValidationService;
    
    @GetMapping("/validate/{code}")
    public ResponseEntity<CertificateValidationResponse> validateCertificate(@PathVariable String code) {
        CertificateValidationResponse response = certificateValidationService.validateCertificate(code);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/participant/{participantId}")
    public ResponseEntity<?> getParticipantCertificates(@PathVariable Long participantId) {
        return ResponseEntity.ok(certificateValidationService.getParticipantCertificates(participantId));
    }
}
