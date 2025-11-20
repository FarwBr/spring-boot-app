package com.example.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Event name is required")
    @Column(nullable = false)
    private String name;
    
    @Column(length = 2000)
    private String description;
    
    @NotBlank(message = "Location is required")
    @Column(nullable = false)
    private String location;
    
    @NotNull(message = "Start time is required")
    @Column(nullable = false)
    private LocalDateTime startTime;
    
    @NotNull(message = "End time is required")
    @Column(nullable = false)
    private LocalDateTime endTime;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @Column(nullable = false)
    private Boolean finished = false;
    
    @Column(nullable = false)
    private Integer maxCapacity = 0;
    
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Participant> participants = new ArrayList<>();
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
