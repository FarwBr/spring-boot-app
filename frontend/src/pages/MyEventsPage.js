import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyEventsPage.css';

const PARTICIPANTS_API = 'http://177.44.248.75:8083/api';
const CHECKIN_API = 'http://177.44.248.75:8084/api';

function MyEventsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, checkedIn: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const showMessage = (msg, type) => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(''), 4000);
  };

  useEffect(() => {
    const fetchMyEvents = async (userId) => {
      try {
        const response = await axios.get(`${PARTICIPANTS_API}/participants/user/${userId}`);
        const events = response.data;
        
        setMyEvents(events);
        
        // Calcular estatísticas
        const checkedInCount = events.filter(p => p.checkedIn).length;
        setStats({
          totalEvents: events.length,
          checkedIn: checkedInCount,
          pending: events.length - checkedInCount
        });
      } catch (error) {
        console.error('Erro ao buscar meus eventos:', error);
        showMessage('Erro ao carregar seus eventos', 'error');
      } finally {
        setLoading(false);
      }
    };

    // Carregar usuário logado
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (!userId) {
      showMessage('Você precisa fazer login primeiro', 'error');
      setLoading(false);
      return;
    }

    setCurrentUser({ id: userId, name: userName, email: userEmail });
    fetchMyEvents(userId);
  }, []);

  const downloadCertificate = async (participantId, eventId, eventName) => {
    try {
      setLoading(true);
      showMessage('Gerando certificado...', 'info');
      
      const response = await axios.get(
        `${CHECKIN_API}/certificates/participant/${participantId}/event/${eventId}`,
        { responseType: 'blob' }
      );
      
      // Criar URL do blob e baixar
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificado-${eventName.replace(/\s+/g, '-')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showMessage('Certificado baixado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao baixar certificado:', error);
      if (error.response?.status === 404) {
        showMessage('Certificado não disponível. Você precisa ter feito check-in.', 'error');
      } else {
        showMessage('Erro ao gerar certificado', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventFinished = (endTime) => {
    return new Date(endTime) < new Date();
  };

  const canDownloadCertificate = (participation) => {
    return participation.checkedIn && isEventFinished(participation.event?.endTime);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-message">
          <h3>⏳ Carregando...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="header-section">
        <h2>🎫 Meus Eventos</h2>
        <div className="user-info">
          <p><strong>👤 {currentUser.name}</strong></p>
          <p className="user-email">{currentUser.email}</p>
        </div>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Estatísticas */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-value">{stats.totalEvents}</div>
          <div className="stat-label">Eventos Inscritos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.checkedIn}</div>
          <div className="stat-label">Check-ins Realizados</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Aguardando Check-in</div>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="events-section">
        <h3>📅 Meus Eventos ({myEvents.length})</h3>
        {myEvents.length === 0 ? (
          <div className="empty-state">
            <p>😔 Você ainda não está inscrito em nenhum evento.</p>
            <p className="info-text">Acesse a página "Eventos" para ver eventos disponíveis e se inscrever.</p>
          </div>
        ) : (
          <div className="events-grid">
            {myEvents.map(participation => {
              const event = participation.event;
              const finished = isEventFinished(event?.endTime);
              const canDownload = canDownloadCertificate(participation);
              
              return (
                <div key={participation.id} className="event-card">
                  <div className="event-header">
                    <h4>{event?.name || 'N/A'}</h4>
                    {finished && <span className="badge badge-finished">✓ Encerrado</span>}
                    {!finished && <span className="badge badge-active">🔴 Ativo</span>}
                  </div>
                  
                  <p className="event-description">{event?.description || 'Sem descrição'}</p>
                  
                  <div className="event-details">
                    <p><strong>📍 Local:</strong> {event?.location || 'N/A'}</p>
                    <p><strong>🕐 Início:</strong> {formatDateTime(event?.startTime)}</p>
                    <p><strong>🕐 Término:</strong> {formatDateTime(event?.endTime)}</p>
                  </div>
                  
                  <div className="event-status">
                    {participation.checkedIn ? (
                      <div>
                        <span className="badge badge-success">✅ Check-in Realizado</span>
                        <p className="checkin-time">
                          <small>{formatDateTime(participation.checkInTime)}</small>
                        </p>
                      </div>
                    ) : (
                      <span className="badge badge-warning">⏳ Aguardando Check-in</span>
                    )}
                  </div>
                  
                  {/* Botão de Certificado */}
                  {canDownload && (
                    <button
                      onClick={() => downloadCertificate(participation.id, event.id, event.name)}
                      disabled={loading}
                      className="btn btn-certificate"
                    >
                      📄 Baixar Certificado
                    </button>
                  )}
                  
                  {finished && !participation.checkedIn && (
                    <div className="info-message">
                      <small>ℹ️ Evento encerrado sem check-in. Certificado não disponível.</small>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEventsPage;
