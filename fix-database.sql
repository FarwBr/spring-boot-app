-- Adicionar coluna finished na tabela events
ALTER TABLE events ADD COLUMN IF NOT EXISTS finished BOOLEAN DEFAULT false;

-- Criar tabela de certificados
CREATE TABLE IF NOT EXISTS certificates (
    id BIGSERIAL PRIMARY KEY,
    validation_code VARCHAR(12) UNIQUE NOT NULL,
    participant_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    issued_at TIMESTAMP NOT NULL,
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_certificates_validation_code ON certificates(validation_code);
CREATE INDEX IF NOT EXISTS idx_certificates_participant ON certificates(participant_id);
CREATE INDEX IF NOT EXISTS idx_certificates_event ON certificates(event_id);
