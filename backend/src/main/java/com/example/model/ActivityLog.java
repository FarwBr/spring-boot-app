package com.example.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String action; // CHECK_IN, PARTICIPANT_CREATED, EVENT_CREATED, etc
    
    @Column(nullable = false)
    private String entity; // PARTICIPANT, EVENT, USER, etc
    
    private Long entityId;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Quem fez a ação
    
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event; // Evento relacionado (se aplicável)
    
    @Column(columnDefinition = "TEXT")
    private String details; // Detalhes adicionais em JSON
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    private String ipAddress;
    
    private String userAgent;
    
    @Column(nullable = false)
    private String level; // INFO, WARNING, ERROR, SUCCESS
    
    // Construtores
    public ActivityLog() {
        this.timestamp = LocalDateTime.now();
        this.level = "INFO";
    }
    
    public ActivityLog(String action, String entity, Long entityId, User user, Event event, String details, String level) {
        this.action = action;
        this.entity = entity;
        this.entityId = entityId;
        this.user = user;
        this.event = event;
        this.details = details;
        this.timestamp = LocalDateTime.now();
        this.level = level;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getAction() {
        return action;
    }
    
    public void setAction(String action) {
        this.action = action;
    }
    
    public String getEntity() {
        return entity;
    }
    
    public void setEntity(String entity) {
        this.entity = entity;
    }
    
    public Long getEntityId() {
        return entityId;
    }
    
    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Event getEvent() {
        return event;
    }
    
    public void setEvent(Event event) {
        this.event = event;
    }
    
    public String getDetails() {
        return details;
    }
    
    public void setDetails(String details) {
        this.details = details;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public String getIpAddress() {
        return ipAddress;
    }
    
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
    
    public String getUserAgent() {
        return userAgent;
    }
    
    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
    
    public String getLevel() {
        return level;
    }
    
    public void setLevel(String level) {
        this.level = level;
    }
}
