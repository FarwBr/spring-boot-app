import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PARTICIPANTS_API = 'http://177.44.248.75:8083/api';
const USERS_API = 'http://177.44.248.75:8081/api';
const EVENTS_API = 'http://177.44.248.75:8082/api';

function MyEventsPage() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [availableEvents, setAvailableEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAvailableEvents, setShowAvailableEvents] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${USERS_API}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      showMessage('Erro ao carregar usuários', 'error');
    }
  };

  const fetchAvailableEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${EVENTS_API}/events/active`);
      setAvailableEvents(response.data);
      setShowAvailableEvents(true);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      showMessage('Erro ao carregar eventos disponíveis', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEvents = async () => {
    if (!selectedUserId) {
      showMessage('Selecione um usuário primeiro', 'error');
      return;
    }

    try {
      setLoading(true);
      const [eventsRes, statsRes] = await Promise.all([
        axios.get(`${PARTICIPANTS_API}/participants/user/${selectedUserId}`),
        axios.get(`${PARTICIPANTS_API}/participants/user/${selectedUserId}/stats`)
      ]);
      
      setMyEvents(eventsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Erro ao buscar meus eventos:', error);
      showMessage('Erro ao carregar seus eventos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    setMyEvents([]);
    setStats({ totalEvents: 0 });
    setShowAvailableEvents(false);
    
    if (userId) {
      fetchMyEvents();
    }
  };

  const registerToEvent = async (eventId) => {
    if (!selectedUserId) {
      showMessage('Selecione um usuário primeiro', 'error');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${PARTICIPANTS_API}/participants/user/${selectedUserId}/event/${eventId}/register`);
      showMessage('Inscrição realizada com sucesso!', 'success');
      
      // Atualizar listas
      fetchMyEvents();
      fetchAvailableEvents();
    } catch (error) {
      console.error('Erro ao se inscrever:', error);
      if (error.response?.status === 400) {
        showMessage(error.response.data.message || 'Você já está inscrito neste evento ou ele está lotado', 'error');
      } else {
        showMessage('Erro ao realizar inscrição', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(''), 3000);
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

  const isEventPast = (endTime) => {
    return new Date(endTime) < new Date();
  };

  const isUserRegistered = (eventId) => {
    return myEvents.some(participation => participation.event?.id === eventId);
  };

  return (
    <div className="page-container">
      <h2>🎫 Meus Eventos</h2>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Seletor de Usuário */}
      <div className="user-selector">
        <label htmlFor="userSelect">
          <strong>Selecione seu usuário:</strong>
        </label>
        <select
          id="userSelect"
          value={selectedUserId}
          onChange={handleUserChange}
          className="form-select"
        >
          <option value="">-- Selecione um usuário --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {selectedUserId && (
        <>
          {/* Estatísticas */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-value">{stats.totalEvents || 0}</div>
              <div className="stat-label">Eventos Inscritos</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {myEvents.filter(p => p.checkedIn).length}
              </div>
              <div className="stat-label">Check-ins Realizados</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {myEvents.filter(p => !p.checkedIn).length}
              </div>
              <div className="stat-label">Aguardando Check-in</div>
            </div>
          </div>

          {/* Botão para ver eventos disponíveis */}
          <div className="action-buttons">
            <button
              onClick={fetchAvailableEvents}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? '⏳ Carregando...' : '🔍 Buscar Eventos Disponíveis'}
            </button>
            <button
              onClick={fetchMyEvents}
              disabled={loading}
              className="btn btn-secondary"
            >
              🔄 Atualizar Minhas Inscrições
            </button>
          </div>

          {/* Eventos Disponíveis */}
          {showAvailableEvents && (
            <div className="events-section">
              <h3>📅 Eventos Disponíveis para Inscrição</h3>
              {availableEvents.length === 0 ? (
                <p className="no-data">Nenhum evento disponível no momento.</p>
              ) : (
                <div className="events-grid">
                  {availableEvents.map(event => {
                    const isPast = isEventPast(event.endTime);
                    const isRegistered = isUserRegistered(event.id);
                    
                    return (
                      <div key={event.id} className="event-card">
                        <div className="event-header">
                          <h4>{event.name}</h4>
                          {isPast && <span className="badge badge-secondary">Encerrado</span>}
                          {isRegistered && <span className="badge badge-success">✓ Inscrito</span>}
                        </div>
                        <p className="event-description">{event.description}</p>
                        <div className="event-details">
                          <p><strong>📍 Local:</strong> {event.location}</p>
                          <p><strong>🕐 Início:</strong> {formatDateTime(event.startTime)}</p>
                          <p><strong>🕐 Término:</strong> {formatDateTime(event.endTime)}</p>
                          <p><strong>👥 Capacidade:</strong> {event.maxCapacity > 0 ? event.maxCapacity : 'Ilimitada'}</p>
                        </div>
                        <button
                          onClick={() => registerToEvent(event.id)}
                          disabled={loading || isPast || isRegistered}
                          className="btn btn-register"
                        >
                          {isRegistered ? '✓ Já Inscrito' : isPast ? '❌ Encerrado' : '➕ Inscrever-se'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Meus Eventos */}
          <div className="events-section">
            <h3>🎟️ Minhas Inscrições ({myEvents.length})</h3>
            {myEvents.length === 0 ? (
              <p className="no-data">Você ainda não está inscrito em nenhum evento.</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Evento</th>
                      <th>Local</th>
                      <th>Data/Hora</th>
                      <th>Status</th>
                      <th>Check-in</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myEvents.map(participation => (
                      <tr key={participation.id}>
                        <td>
                          <strong>{participation.event?.name || 'N/A'}</strong>
                          <br />
                          <small>{participation.event?.description || ''}</small>
                        </td>
                        <td>{participation.event?.location || 'N/A'}</td>
                        <td>
                          {formatDateTime(participation.event?.startTime)}
                          <br />
                          <small>até {formatDateTime(participation.event?.endTime)}</small>
                        </td>
                        <td>
                          {isEventPast(participation.event?.endTime) ? (
                            <span className="badge badge-secondary">Encerrado</span>
                          ) : (
                            <span className="badge badge-info">Ativo</span>
                          )}
                        </td>
                        <td>
                          {participation.checkedIn ? (
                            <div>
                              <span className="badge badge-success">✓ Feito</span>
                              <br />
                              <small>{formatDateTime(participation.checkInTime)}</small>
                            </div>
                          ) : (
                            <span className="badge badge-warning">⏳ Pendente</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {!selectedUserId && (
        <div className="welcome-message">
          <h3>👋 Bem-vindo ao sistema de eventos!</h3>
          <p>Selecione seu usuário acima para começar.</p>
          <ul>
            <li>✅ Veja eventos disponíveis</li>
            <li>✅ Inscreva-se em eventos</li>
            <li>✅ Acompanhe seus check-ins</li>
          </ul>
        </div>
      )}

      <style jsx>{`
        .page-container {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .user-selector {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        .user-selector label {
          display: block;
          margin-bottom: 10px;
          color: #333;
        }

        .form-select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .stat-value {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.9;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
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
        }

        .btn-secondary {
          background: #2196F3;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #0b7dda;
        }

        .btn-register {
          width: 100%;
          background: #FF9800;
          color: white;
          margin-top: 10px;
        }

        .btn-register:hover:not(:disabled) {
          background: #e68900;
        }

        .events-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        .events-section h3 {
          margin-top: 0;
          color: #333;
          border-bottom: 2px solid #667eea;
          padding-bottom: 10px;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .event-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 10px;
        }

        .event-header h4 {
          margin: 0;
          color: #333;
          flex: 1;
        }

        .event-description {
          color: #666;
          margin-bottom: 15px;
          font-size: 14px;
        }

        .event-details {
          font-size: 14px;
          color: #555;
          margin-bottom: 10px;
        }

        .event-details p {
          margin: 5px 0;
        }

        .table-container {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .data-table th,
        .data-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .data-table th {
          background-color: #667eea;
          color: white;
          font-weight: bold;
        }

        .data-table tbody tr:hover {
          background-color: #f5f5f5;
        }

        .badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }

        .badge-success {
          background-color: #4CAF50;
          color: white;
        }

        .badge-warning {
          background-color: #FF9800;
          color: white;
        }

        .badge-info {
          background-color: #2196F3;
          color: white;
        }

        .badge-secondary {
          background-color: #9E9E9E;
          color: white;
        }

        .message {
          padding: 12px 20px;
          border-radius: 4px;
          margin-bottom: 20px;
          animation: slideDown 0.3s ease;
        }

        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .no-data {
          text-align: center;
          color: #999;
          padding: 40px;
          font-style: italic;
        }

        .welcome-message {
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }

        .welcome-message h3 {
          color: #667eea;
          margin-bottom: 20px;
        }

        .welcome-message ul {
          list-style: none;
          padding: 0;
          max-width: 400px;
          margin: 20px auto;
        }

        .welcome-message li {
          padding: 10px;
          margin: 5px 0;
          background: #f5f5f5;
          border-radius: 4px;
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

        @media (max-width: 768px) {
          .events-grid {
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
