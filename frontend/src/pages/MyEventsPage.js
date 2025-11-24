import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyEventsPage.css';

const USERS_API = 'http://177.44.248.75:8081/api';
const PARTICIPANTS_API = 'http://177.44.248.75:8083/api';
const CHECKIN_API = 'http://177.44.248.75:8084/api';

function MyEventsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    initializePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializePage = async () => {
    try {
      const userDataString = localStorage.getItem('user');
      
      if (!userDataString) {
        showMessage('Você precisa fazer login primeiro', 'error');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userDataString);
      const { id: userId, name: userName, email: userEmail, role: userRole } = userData;

      if (!userId || !userName) {
        showMessage('Dados de login inválidos. Faça login novamente.', 'error');
        setLoading(false);
        return;
      }

      const user = { id: userId, name: userName, email: userEmail };
      setCurrentUser(user);
      const adminStatus = userRole === 'ADMIN';
      setIsAdmin(adminStatus);

      if (adminStatus) {
        await loadUsers();
        setLoading(false);
      } else {
        setSelectedUserId(userId);
        await loadUserEvents(userId);
      }
    } catch (error) {
      console.error('Erro ao inicializar:', error);
      showMessage('Erro ao carregar dados. Verifique seu login.', 'error');
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get(`${USERS_API}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      showMessage('Erro ao carregar lista de usuários', 'error');
    }
  };

  const loadUserEvents = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${PARTICIPANTS_API}/participants/user/${userId}`);
      setMyEvents(response.data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      showMessage('Erro ao carregar eventos do usuário', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    if (userId) {
      loadUserEvents(userId);
    } else {
      setMyEvents([]);
    }
  };

  const downloadCertificate = async (participantId, eventId, eventName) => {
    try {
      showMessage('Abrindo certificado...', 'info');
      
      // Abrir o PDF em nova aba
      const url = `${CHECKIN_API}/certificates/participant/${participantId}/event/${eventId}`;
      window.open(url, '_blank');
      
      showMessage('Certificado aberto com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao abrir certificado:', error);
      showMessage('Erro ao gerar certificado', 'error');
    }
  };

  const cancelParticipation = async (participantId, eventName) => {
    if (!window.confirm(`Deseja realmente cancelar sua participação no evento "${eventName}"?`)) {
      return;
    }

    try {
      await axios.delete(`${PARTICIPANTS_API}/participants/${participantId}`);
      showMessage('Participação cancelada com sucesso!', 'success');
      loadUserEvents(selectedUserId);
    } catch (error) {
      console.error('Erro ao cancelar participação:', error);
      showMessage('Erro ao cancelar participação', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
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
    if (!endTime) return false;
    const eventEnd = new Date(endTime);
    const now = new Date();
    return eventEnd < now;
  };

  const isEventStarted = (startTime) => {
    return new Date(startTime) < new Date();
  };

  const canDownloadCertificate = (participation) => {
    return participation.checkedIn && isEventFinished(participation.event?.endTime);
  };

  const canCancelParticipation = (participation) => {
    return !participation.checkedIn && !isEventStarted(participation.event?.startTime);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3>⏳ Carregando...</h3>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          maxWidth: '500px',
          margin: '0 auto',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#dc3545', marginBottom: '20px' }}>⚠️ Login Necessário</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Você precisa fazer login primeiro para acessar seus eventos.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            🔄 Recarregar Página
          </button>
        </div>
      </div>
    );
  }

  const activeEvents = myEvents.filter(p => !isEventFinished(p.event?.endTime));
  const finishedEvents = myEvents.filter(p => isEventFinished(p.event?.endTime));

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>🎫 Meus Eventos</h2>
        {isAdmin ? (
          <p style={{ margin: 0, opacity: 0.9 }}>👨‍💼 Modo Admin - Selecione um usuário para visualizar seus eventos</p>
        ) : (
          <div>
            <p style={{ margin: '5px 0', fontSize: '18px' }}><strong>👤 {currentUser?.name}</strong></p>
            <p style={{ margin: '5px 0', opacity: 0.9, fontSize: '14px' }}>{currentUser?.email}</p>
          </div>
        )}
      </div>

      {message && (
        <div style={{
          padding: '15px 20px',
          marginBottom: '20px',
          borderRadius: '8px',
          background: message.type === 'success' ? '#d4edda' : message.type === 'error' ? '#f8d7da' : '#d1ecf1',
          color: message.type === 'success' ? '#155724' : message.type === 'error' ? '#721c24' : '#0c5460',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : message.type === 'error' ? '#f5c6cb' : '#bee5eb'}`
        }}>
          {message.text}
        </div>
      )}

      {isAdmin && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>
            Selecionar Usuário:
          </label>
          <select
            value={selectedUserId || ''}
            onChange={(e) => handleUserSelect(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <option value="">Selecione um usuário...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email}) - {user.role}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedUserId ? (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'white',
              padding: '25px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #667eea'
            }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea' }}>{myEvents.length}</div>
              <div style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Total de Eventos</div>
            </div>
            <div style={{
              background: 'white',
              padding: '25px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #28a745'
            }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#28a745' }}>{activeEvents.length}</div>
              <div style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Eventos Ativos</div>
            </div>
            <div style={{
              background: 'white',
              padding: '25px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #6c757d'
            }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#6c757d' }}>{finishedEvents.length}</div>
              <div style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Eventos Finalizados</div>
            </div>
          </div>

          {myEvents.length === 0 ? (
            <div style={{
              background: 'white',
              padding: '60px 20px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '18px', color: '#999', margin: '10px 0' }}>
                😔 {isAdmin ? 'Este usuário não está' : 'Você ainda não está'} inscrito em nenhum evento.
              </p>
              {!isAdmin && (
                <p style={{ fontSize: '14px', color: '#999', margin: '10px 0' }}>
                  Acesse a página "Eventos" para ver eventos disponíveis e se inscrever.
                </p>
              )}
            </div>
          ) : (
            <>
              {activeEvents.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ marginBottom: '15px', color: '#333' }}>🔴 Eventos Ativos ({activeEvents.length})</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '20px'
                  }}>
                    {activeEvents.map(participation => {
                      const event = participation.event;
                      return (
                        <div key={participation.id} style={{
                          background: 'white',
                          borderRadius: '8px',
                          padding: '20px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          borderLeft: '4px solid #28a745'
                        }}>
                          <div style={{ marginBottom: '15px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{event?.name || 'N/A'}</h4>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              background: '#28a745',
                              color: 'white'
                            }}>
                              🔴 Ativo
                            </span>
                          </div>
                          
                          <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                            {event?.description || 'Sem descrição'}
                          </p>
                          
                          <div style={{ fontSize: '14px', marginBottom: '15px' }}>
                            <p style={{ margin: '5px 0' }}><strong>📍 Local:</strong> {event?.location || 'N/A'}</p>
                            <p style={{ margin: '5px 0' }}><strong>🕐 Início:</strong> {formatDateTime(event?.startTime)}</p>
                            <p style={{ margin: '5px 0' }}><strong>🕐 Término:</strong> {formatDateTime(event?.endTime)}</p>
                          </div>
                          
                          <div style={{ marginBottom: '15px' }}>
                            {participation.checkedIn ? (
                              <div>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  background: '#28a745',
                                  color: 'white'
                                }}>
                                  ✅ Check-in Realizado
                                </span>
                                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                  {formatDateTime(participation.checkInTime)}
                                </p>
                              </div>
                            ) : (
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                background: '#ffc107',
                                color: '#000'
                              }}>
                                ⏳ Aguardando Check-in
                              </span>
                            )}
                          </div>
                          
                          {!isAdmin && canCancelParticipation(participation) && (
                            <button
                              onClick={() => cancelParticipation(participation.id, event.name)}
                              style={{
                                width: '100%',
                                padding: '10px',
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '14px'
                              }}
                            >
                              ❌ Cancelar Participação
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {finishedEvents.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: '15px', color: '#333' }}>✓ Eventos Finalizados ({finishedEvents.length})</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '20px'
                  }}>
                    {finishedEvents.map(participation => {
                      const event = participation.event;
                      const canDownload = canDownloadCertificate(participation);
                      
                      return (
                        <div key={participation.id} style={{
                          background: 'white',
                          borderRadius: '8px',
                          padding: '20px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          borderLeft: '4px solid #6c757d',
                          opacity: 0.9
                        }}>
                          <div style={{ marginBottom: '15px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{event?.name || 'N/A'}</h4>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              background: '#6c757d',
                              color: 'white'
                            }}>
                              ✓ Encerrado
                            </span>
                          </div>
                          
                          <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                            {event?.description || 'Sem descrição'}
                          </p>
                          
                          <div style={{ fontSize: '14px', marginBottom: '15px' }}>
                            <p style={{ margin: '5px 0' }}><strong>📍 Local:</strong> {event?.location || 'N/A'}</p>
                            <p style={{ margin: '5px 0' }}><strong>🕐 Início:</strong> {formatDateTime(event?.startTime)}</p>
                            <p style={{ margin: '5px 0' }}><strong>🕐 Término:</strong> {formatDateTime(event?.endTime)}</p>
                          </div>
                          
                          <div style={{ marginBottom: '15px' }}>
                            {participation.checkedIn ? (
                              <div>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  background: '#28a745',
                                  color: 'white'
                                }}>
                                  ✅ Check-in Realizado
                                </span>
                                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                  {formatDateTime(participation.checkInTime)}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  background: '#dc3545',
                                  color: 'white'
                                }}>
                                  ❌ Sem Check-in
                                </span>
                                <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                                  Certificado não disponível
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {canDownload && (
                            <button
                              onClick={() => downloadCertificate(participation.id, event.id, event.name)}
                              style={{
                                width: '100%',
                                padding: '10px',
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '14px'
                              }}
                            >
                              📄 Ver Certificado
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : isAdmin && (
        <div style={{
          background: 'white',
          padding: '60px 20px',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '18px', color: '#999' }}>
            👆 Selecione um usuário acima para visualizar seus eventos
          </p>
        </div>
      )}
    </div>
  );
}

export default MyEventsPage;
