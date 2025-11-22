package com.example.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "participants", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "event_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Participant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Relacionamento com User (se for usuário registrado)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;
    
    // Campos para walk-ins (participantes sem cadastro prévio)
    @Column(nullable = true)
    private String name;
    
    @Email(message = "Invalid email format")
    @Column(nullable = true)
    private String email;
    
    @Column(nullable = true)
    private String phone;
    
    @Column(nullable = true)
    private String company;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnore
    private Event event;
    
    @Column(nullable = false)
    private Boolean checkedIn = false;
    
    @Column(nullable = true)
    private LocalDateTime checkInTime;
    
    @Column(nullable = false)
    private Boolean isWalkIn = false;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        
        // Se tem user, SEMPRE copiar dados do user para facilitar queries e exibição
        if (user != null) {
            name = user.getName();
            email = user.getEmail();
            phone = user.getPhone();
            company = user.getCompany();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        
        // Atualizar dados do user se existir
        if (user != null) {
            name = user.getName();
            email = user.getEmail();
            phone = user.getPhone();
            company = user.getCompany();
        }
    }
    
    // Helper method para obter nome (de user ou walk-in)
    public String getDisplayName() {
        if (user != null) {
            return user.getName();
        }
        return name;
    }
    
    // Helper method para obter email
    public String getDisplayEmail() {
        if (user != null) {
            return user.getEmail();
        }
        return email;
    }
}
