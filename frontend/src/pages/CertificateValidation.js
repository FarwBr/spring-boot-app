import React, { useState } from 'react';
import axios from 'axios';
import './CertificateValidation.css';

const API_URL = 'http://177.44.248.75:8084/api';

function CertificateValidation() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      alert('Por favor, insira o código do certificado');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/certificates/validate/${code.trim().toUpperCase()}`);
      setResult(response.data);
    } catch (error) {
      console.error('Erro ao validar certificado:', error);
      setResult({
        valid: false,
        message: 'Erro ao validar certificado. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="validation-page">
      <div className="validation-container">
        <div className="validation-header">
          <h1>🔍 Validar Certificado</h1>
          <p>Insira o código de validação para verificar a autenticidade do certificado</p>
        </div>

        <form onSubmit={handleValidate} className="validation-form">
          <div className="form-group">
            <label htmlFor="code">Código de Validação</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ex: A1B2C3D4E5F6"
              maxLength={12}
              className="code-input"
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn-validate" disabled={loading}>
            {loading ? '🔄 Validando...' : '✓ Validar Certificado'}
          </button>
        </form>

        {result && (
          <div className={`result-card ${result.valid ? 'valid' : 'invalid'}`}>
            <div className="result-icon">
              {result.valid ? '✅' : '❌'}
            </div>
            <h2>{result.message}</h2>
            
            {result.valid && (
              <div className="certificate-details">
                <div className="detail-row">
                  <span className="label">Participante:</span>
                  <span className="value">{result.participantName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Evento:</span>
                  <span className="value">{result.eventName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Local:</span>
                  <span className="value">{result.eventLocation}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Data do Evento:</span>
                  <span className="value">{formatDate(result.eventDate)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Check-in:</span>
                  <span className="value">{formatDate(result.checkInTime)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Emitido em:</span>
                  <span className="value">{formatDate(result.certificateIssuedAt)}</span>
                </div>
                <div className="detail-row validation-code-row">
                  <span className="label">Código:</span>
                  <span className="value code">{result.validationCode}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="info-box">
          <h3>ℹ️ Como usar</h3>
          <ul>
            <li>O código de validação está no certificado PDF recebido por email</li>
            <li>Insira o código no campo acima (12 caracteres)</li>
            <li>Clique em "Validar Certificado"</li>
            <li>Se o certificado for válido, os detalhes serão exibidos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CertificateValidation;
