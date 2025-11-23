import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PARTICIPANTS_API = 'http://177.44.248.75:8083/api';
const EVENTS_API = 'http://177.44.248.75:8082/api';
const CHECKIN_API = 'http://177.44.248.75:8084/api';

function MyEventsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, checkedIn: 0, pending: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se é admin - se for, redirecionar
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'ADMIN') {
      setMessage({ text: 'Esta página é apenas para usuários finais. Redirecionando...', type: 'error' });
      setTimeout(() => navigate('/events'), 2000);
      return;
    }

    // Carregar usuário logado
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (!userId) {
      setMessage({ text: 'Você precisa fazer login primeiro', type: 'error' });
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    setCurrentUser({ id: userId, name: userName, email: userEmail });
    fetchMyEvents(userId);
  }, [navigate]);

  const fetchMyEvents = async (userId) => {
    try {
      setLoading(true);
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

  const showMessage = (msg, type) => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(''), 4000);
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

  if (!currentUser) {
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

      {/* Botão Atualizar */}
      <div className="action-buttons">
        <button
          onClick={() => fetchMyEvents(currentUser.id)}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? '⏳ Carregando...' : '🔄 Atualizar'}
        </button>
      </div>

      {/* Lista de Eventos */}
      <div className="events-section">
        <h3>📅 Meus Eventos ({myEvents.length})</h3>
        {myEvents.length === 0 ? (
          <div className="empty-state">
            <p>😔 Você ainda não está inscrito em nenhum evento.</p>
            <button onClick={() => navigate('/events')} className="btn btn-secondary">
              🔍 Buscar Eventos Disponíveis
            </button>
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

      <style>{`
        .page-container {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .header-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .header-section h2 {
          margin: 0 0 15px 0;
          font-size: 32px;
        }

        .user-info p {
          margin: 5px 0;
        }

        .user-email {
          opacity: 0.9;
          font-size: 14px;
        }

        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-left: 4px solid #667eea;
        }

        .stat-value {
          font-size: 48px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #4CAF50;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #45a049;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
        }

        .btn-secondary {
          background: #2196F3;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #0b7dda;
        }

        .btn-certificate {
          width: 100%;
          background: #FF5722;
          color: white;
          margin-top: 10px;
          font-size: 14px;
          padding: 10px;
        }

        .btn-certificate:hover:not(:disabled) {
          background: #E64A19;
          transform: scale(1.02);
        }

        .events-section {
          background: white;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .events-section h3 {
          margin-top: 0;
          color: #333;
          border-bottom: 3px solid #667eea;
          padding-bottom: 12px;
          font-size: 24px;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .event-card {
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          transition: transform 0.3s, box-shadow 0.3s;
          background: #fafafa;
        }

        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 12px;
        }

        .event-header h4 {
          margin: 0;
          color: #333;
          flex: 1;
          font-size: 18px;
        }

        .event-description {
          color: #666;
          margin-bottom: 15px;
          font-size: 14px;
          line-height: 1.5;
        }

        .event-details {
          font-size: 14px;
          color: #555;
          margin-bottom: 15px;
          background: white;
          padding: 12px;
          border-radius: 6px;
        }

        .event-details p {
          margin: 8px 0;
        }

        .event-status {
          margin-bottom: 10px;
        }

        .checkin-time {
          margin-top: 5px;
          color: #666;
        }

        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          margin-left: 8px;
        }

        .badge-success {
          background-color: #4CAF50;
          color: white;
        }

        .badge-warning {
          background-color: #FF9800;
          color: white;
        }

        .badge-active {
          background-color: #F44336;
          color: white;
          animation: pulse 2s infinite;
        }

        .badge-finished {
          background-color: #9E9E9E;
          color: white;
        }

        .info-message {
          margin-top: 10px;
          padding: 8px;
          background: #fff3cd;
          border-left: 3px solid #ffc107;
          border-radius: 4px;
          color: #856404;
        }

        .message {
          padding: 15px 20px;
          border-radius: 6px;
          margin-bottom: 20px;
          animation: slideDown 0.3s ease;
          font-weight: 500;
        }

        .message.success {
          background-color: #d4edda;
          color: #155724;
          border-left: 4px solid #28a745;
        }

        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border-left: 4px solid #dc3545;
        }

        .message.info {
          background-color: #d1ecf1;
          color: #0c5460;
          border-left: 4px solid #17a2b8;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #999;
        }

        .empty-state p {
          font-size: 18px;
          margin-bottom: 20px;
        }

        .loading-message {
          text-align: center;
          padding: 100px 20px;
          color: #666;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @media (max-width: 768px) {
          .events-grid {
            grid-template-columns: 1fr;
          }

          .stats-container {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default MyEventsPage;
