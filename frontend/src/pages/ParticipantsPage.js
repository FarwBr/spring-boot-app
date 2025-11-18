import React, { useState, useEffect } from 'react';
import * as participantService from '../services/participantService';
import * as eventService from '../services/eventService';

function ParticipantsPage() {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [participants, setParticipants] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: ''
    });

    useEffect(() => {
        loadEvents();
    }, []);

    useEffect(() => {
        if (selectedEventId) {
            loadParticipants();
            loadStats();
        }
    }, [selectedEventId]);

    const loadEvents = async () => {
        try {
            const data = await eventService.getActiveEvents();
            setEvents(data);
        } catch (err) {
            console.error('Erro ao carregar eventos:', err);
        }
    };

    const loadParticipants = async () => {
        try {
            setLoading(true);
            const data = await participantService.getParticipantsByEvent(selectedEventId);
            setParticipants(data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar participantes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const data = await participantService.getEventStats(selectedEventId);
            setStats(data);
        } catch (err) {
            console.error('Erro ao carregar estatísticas:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEventId) {
            setError('Selecione um evento primeiro');
            return;
        }
        try {
            await participantService.createParticipant(selectedEventId, formData);
            setShowForm(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: ''
            });
            loadParticipants();
            loadStats();
        } catch (err) {
            setError('Erro ao adicionar participante');
            console.error(err);
        }
    };

    const handleCheckIn = async (id) => {
        try {
            await participantService.checkIn(id);
            loadParticipants();
            loadStats();
        } catch (err) {
            setError('Erro ao fazer check-in');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja remover este participante?')) {
            try {
                await participantService.deleteParticipant(id);
                loadParticipants();
                loadStats();
            } catch (err) {
                setError('Erro ao deletar participante');
            }
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('pt-BR');
    };

    return (
        <div>
            <div className="page-header">
                <h2>👥 Gerenciamento de Participantes</h2>
                <p>Gerencie participantes e check-ins dos eventos</p>
            </div>
            
            {error && <div className="alert alert-error">{error}</div>}
            
            <div className="card" style={{marginBottom: '20px'}}>
                <div className="card-header">
                    <h3 className="card-title">🎯 Selecionar Evento</h3>
                </div>
                <div className="form-group">
                    <label>Evento</label>
                    <select 
                        value={selectedEventId} 
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        style={{width: '100%', padding: '10px', fontSize: '14px'}}
                    >
                        <option value="">Selecione um evento...</option>
                        {events.map(event => (
                            <option key={event.id} value={event.id}>
                                {event.name} - {event.location} ({new Date(event.startTime).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedEventId && (
                <>
                    {stats && (
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px'}}>
                            <div className="card" style={{padding: '20px', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
                                <div style={{fontSize: '36px', fontWeight: 'bold'}}>{stats.total}</div>
                                <div style={{fontSize: '14px', opacity: 0.9}}>Total de Participantes</div>
                            </div>
                            <div className="card" style={{padding: '20px', textAlign: 'center', background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: 'white'}}>
                                <div style={{fontSize: '36px', fontWeight: 'bold'}}>{stats.checkedIn}</div>
                                <div style={{fontSize: '14px', opacity: 0.9}}>Check-in Realizado</div>
                            </div>
                            <div className="card" style={{padding: '20px', textAlign: 'center', background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)', color: 'white'}}>
                                <div style={{fontSize: '36px', fontWeight: 'bold'}}>{stats.pending}</div>
                                <div style={{fontSize: '14px', opacity: 0.9}}>Pendentes</div>
                            </div>
                        </div>
                    )}

                    <div style={{marginBottom: '20px'}}>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? '❌ Cancelar' : '➕ Adicionar Participante'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="card" style={{marginBottom: '20px'}}>
                            <div className="card-header">
                                <h3 className="card-title">➕ Novo Participante</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Nome *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                                    <div className="form-group">
                                        <label>Telefone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Empresa</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-success">
                                    ➕ Adicionar
                                </button>
                            </form>
                        </div>
                    )}
                    
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">📋 Lista de Participantes</h3>
                            <span className="badge badge-info">{participants.length} participantes</span>
                        </div>
                        {loading ? (
                            <div className="loading">
                                <div className="spinner"></div>
                                <p>Carregando...</p>
                            </div>
                        ) : participants.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">👥</div>
                                <h3 className="empty-state-title">Nenhum participante cadastrado</h3>
                                <p className="empty-state-description">Adicione participantes para este evento</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Email</th>
                                            <th>Telefone</th>
                                            <th>Empresa</th>
                                            <th>Check-in</th>
                                            <th>Tipo</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {participants.map(participant => (
                                            <tr key={participant.id} style={{
                                                backgroundColor: participant.checkedIn ? '#d4edda' : 'transparent'
                                            }}>
                                                <td><strong>{participant.name}</strong></td>
                                                <td>{participant.email || '-'}</td>
                                                <td>{participant.phone || '-'}</td>
                                                <td>{participant.company || '-'}</td>
                                                <td>
                                                    {participant.checkedIn ? (
                                                        <>
                                                            <span className="badge badge-success">✅ Feito</span>
                                                            <div style={{fontSize: '11px', color: '#666'}}>
                                                                {formatDateTime(participant.checkInTime)}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <span className="badge badge-warning">⏳ Pendente</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {participant.isWalkIn ? (
                                                        <span className="badge" style={{background: '#ff9800', color: 'white'}}>
                                                            🚶 Walk-in
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-info">📝 Pré-cadastro</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {!participant.checkedIn && (
                                                        <button 
                                                            onClick={() => handleCheckIn(participant.id)} 
                                                            className="btn btn-success btn-sm"
                                                            style={{marginRight: '5px'}}
                                                        >
                                                            ✅ Check-in
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDelete(participant.id)} 
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        🗑️
                                                    </button>
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
        </div>
    );
}

export default ParticipantsPage;
