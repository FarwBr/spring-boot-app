package com.example.repository;

import com.example.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByValidationCode(String validationCode);
    List<Certificate> findByEventId(Long eventId);
    List<Certificate> findByParticipantId(Long participantId);
    Optional<Certificate> findByParticipantIdAndEventId(Long participantId, Long eventId);
}
