import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LogsPage.css';

const LOGS_API = 'http://177.44.248.75:8081/api';

function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, CHECK_IN, ERROR, WARNING, SUCCESS
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [page, filter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let response;
      
      if (filter === 'all') {
        response = await axios.get(`${LOGS_API}/logs?page=${page}&size=50`);
        setLogs(response.data.content);
        setTotalPages(response.data.totalPages);
      } else if (['ERROR', 'WARNING', 'SUCCESS', 'INFO'].includes(filter)) {
        response = await axios.get(`${LOGS_API}/logs/level/${filter}`);
        setLogs(response.data);
      } else {
        response = await axios.get(`${LOGS_API}/logs/action/${filter}`);
        setLogs(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${LOGS_API}/logs/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'SUCCESS': return '✅';
      case 'INFO': return 'ℹ️';
      case 'WARNING': return '⚠️';
      case 'ERROR': return '❌';
      default: return '📝';
    }
  };

  const getActionLabel = (action) => {
    const labels = {
      'CHECK_IN': 'Check-in Realizado',
      'PARTICIPANT_CREATED': 'Participante Criado',
      'EVENT_CREATED': 'Evento Criado',
      'EVENT_UPDATED': 'Evento Atualizado',
      'USER_CREATED': 'Usuário Criado',
      'USER_LOGIN': 'Login',
      'CERTIFICATE_GENERATED': 'Certificado Gerado',
      'EMAIL_SENT': 'Email Enviado'
    };
    return labels[action] || action;
  };

  return (
    <div className="logs-page">
      <div className="logs-header">
        <h1>📊 Logs de Atividade</h1>
        <button className="btn btn-refresh" onClick={() => { fetchLogs(); fetchStats(); }}>
          🔄 Atualizar
        </button>
      </div>

      {/* Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total || 0}</div>
            <div className="stat-label">Total de Logs</div>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.checkIns || 0}</div>
            <div className="stat-label">Check-ins</div>
          </div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.participantsCreated || 0}</div>
            <div className="stat-label">Participantes</div>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.warnings || 0}</div>
            <div className="stat-label">Avisos</div>
          </div>
        </div>
        
        <div className="stat-card error">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-value">{stats.errors || 0}</div>
            <div className="stat-label">Erros</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-bar">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos
        </button>
        <button 
          className={`filter-btn ${filter === 'CHECK_IN' ? 'active' : ''}`}
          onClick={() => setFilter('CHECK_IN')}
        >
          Check-ins
        </button>
        <button 
          className={`filter-btn ${filter === 'SUCCESS' ? 'active' : ''}`}
          onClick={() => setFilter('SUCCESS')}
        >
          Sucesso
        </button>
        <button 
          className={`filter-btn ${filter === 'WARNING' ? 'active' : ''}`}
          onClick={() => setFilter('WARNING')}
        >
          Avisos
        </button>
        <button 
          className={`filter-btn ${filter === 'ERROR' ? 'active' : ''}`}
          onClick={() => setFilter('ERROR')}
        >
          Erros
        </button>
      </div>

      {/* Lista de Logs */}
      <div className="logs-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum log encontrado</p>
          </div>
        ) : (
          <div className="logs-list">
            {logs.map(log => (
              <div key={log.id} className={`log-item level-${log.level.toLowerCase()}`}>
                <div className="log-icon">
                  {getLevelIcon(log.level)}
                </div>
                <div className="log-content">
                  <div className="log-header-row">
                    <span className="log-action">{getActionLabel(log.action)}</span>
                    <span className="log-time">{formatDateTime(log.timestamp)}</span>
                  </div>
                  
                  <div className="log-details">
                    {log.details && <div className="log-description">{log.details}</div>}
                    
                    <div className="log-meta">
                      {log.user && (
                        <span className="log-meta-item">
                          👤 {log.user.name}
                        </span>
                      )}
                      {log.event && (
                        <span className="log-meta-item">
                          🎯 {log.event.name}
                        </span>
                      )}
                      {log.entity && (
                        <span className="log-meta-item">
                          📦 {log.entity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`log-badge badge-${log.level.toLowerCase()}`}>
                  {log.level}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginação */}
      {filter === 'all' && totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            ← Anterior
          </button>
          <span className="pagination-info">
            Página {page + 1} de {totalPages}
          </span>
          <button 
            className="pagination-btn"
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}

export default LogsPage;
