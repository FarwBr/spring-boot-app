package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateValidationResponse {
    private boolean valid;
    private String message;
    private String participantName;
    private String eventName;
    private String eventLocation;
    private LocalDateTime eventDate;
    private LocalDateTime checkInTime;
    private LocalDateTime certificateIssuedAt;
    private String validationCode;
}
