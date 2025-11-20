package com.example.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "certificates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Certificate {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String validationCode;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id", nullable = false)
    private Participant participant;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @Column(nullable = false)
    private LocalDateTime issuedAt;
    
    @Column(nullable = false)
    private Boolean emailSent = false;
    
    @Column
    private LocalDateTime emailSentAt;
    
    @PrePersist
    protected void onCreate() {
        if (validationCode == null) {
            validationCode = UUID.randomUUID().toString().toUpperCase().substring(0, 12);
        }
        if (issuedAt == null) {
            issuedAt = LocalDateTime.now();
        }
    }
}
