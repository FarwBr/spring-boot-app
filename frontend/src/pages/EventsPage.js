import React, { useState, useEffect } from 'react';
import * as eventService from '../services/eventService';

function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        startTime: '',
        endTime: '',
        maxCapacity: 100,
        active: true
    });
    const [editingId, setEditingId] = useState(null);
    
    // Verificar se usuário é ADMIN
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsed = JSON.parse(userData);
                setUser(parsed);
                setIsAdmin(parsed?.role === 'ADMIN');
            } catch (e) {
                console.error('Erro ao ler usuário do localStorage:', e);
            }
        }
    }, []);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const data = await eventService.getAllEvents();
            setEvents(data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar eventos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await eventService.updateEvent(editingId, formData);
            } else {
                await eventService.createEvent(formData);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({
                name: '',
                description: '',
                location: '',
                startTime: '',
                endTime: '',
                maxCapacity: 100,
                active: true
            });
            loadEvents();
        } catch (err) {
            setError('Erro ao salvar evento');
            console.error(err);
        }
    };

    const handleEdit = (event) => {
        setFormData({
            name: event.name,
            description: event.description,
            location: event.location,
            startTime: event.startTime,
            endTime: event.endTime,
            maxCapacity: event.maxCapacity,
            active: event.active
        });
        setEditingId(event.id);
        setShowForm(true);
    };

    const handleToggleStatus = async (id) => {
        try {
            await eventService.toggleEventStatus(id);
            loadEvents();
        } catch (err) {
            setError('Erro ao alterar status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este evento?')) {
            try {
                await eventService.deleteEvent(id);
                loadEvents();
            } catch (err) {
                setError('Erro ao deletar evento');
            }
        }
    };

    const handleFinishEvent = async (id) => {
        if (window.confirm('Tem certeza que deseja finalizar este evento?\n\nIsso irá:\n✅ Gerar certificados para todos os participantes com check-in\n📧 Enviar certificados por email\n\n⚠️ Esta ação não pode ser desfeita!')) {
            try {
                setLoading(true);
                await eventService.finishEvent(id);
                alert('✅ Evento finalizado com sucesso!\n🎓 Certificados estão sendo gerados e enviados por email.');
                loadEvents();
            } catch (err) {
                setError('Erro ao finalizar evento: ' + (err.response?.data || err.message));
                alert('❌ Erro ao finalizar evento. Verifique o console para mais detalhes.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRegisterToEvent = async (eventId) => {
        if (!user || !user.id) {
            setError('Erro: Usuário não identificado. Faça login novamente.');
            return;
        }

        if (window.confirm('Deseja se inscrever neste evento?')) {
            try {
                setLoading(true);
                const response = await fetch(`http://177.44.248.75:8083/api/participants/user/${user.id}/event/${eventId}/register`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('✅ Inscrição realizada com sucesso!\n\nVocê pode visualizar seus eventos em "🎫 Meus Eventos".');
                    loadEvents();
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Erro ao realizar inscrição');
                    alert('❌ ' + (errorData.message || 'Erro ao realizar inscrição. Você já pode estar inscrito ou o evento está lotado.'));
                }
            } catch (err) {
                setError('Erro ao realizar inscrição');
                alert('❌ Erro ao realizar inscrição. Tente novamente.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Carregando eventos...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>🎉 Gerenciamento de Eventos</h2>
                <p>Crie e gerencie eventos para check-in de participantes</p>
            </div>
            
            {error && <div className="alert alert-error">{error}</div>}
            
            {isAdmin && (
                <div style={{marginBottom: '20px'}}>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => {
                            setShowForm(!showForm);
                            setEditingId(null);
                            setFormData({
                                name: '',
                                description: '',
                                location: '',
                                startTime: '',
                                endTime: '',
                                maxCapacity: 100,
                                active: true
                            });
                        }}
                    >
                        {showForm ? '❌ Cancelar' : '➕ Novo Evento'}
                    </button>
                </div>
            )}
            
            {!isAdmin && (
                <div className="alert" style={{backgroundColor: '#e3f2fd', color: '#1976d2', marginBottom: '20px'}}>
                    ℹ️ Você pode se inscrever nos eventos disponíveis através do menu "🎫 Meus Eventos"
                </div>
            )}

            {showForm && (
                <div className="card" style={{marginBottom: '20px'}}>
                    <div className="card-header">
                        <h3 className="card-title">{editingId ? '✏️ Editar Evento' : '➕ Novo Evento'}</h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nome do Evento *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Descrição</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                style={{width: '100%', padding: '8px', fontSize: '14px'}}
                            />
                        </div>
                        <div className="form-group">
                            <label>Local *</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                            <div className="form-group">
                                <label>Data/Hora Início *</label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Data/Hora Fim *</label>
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Capacidade Máxima</label>
                            <input
                                type="number"
                                name="maxCapacity"
                                value={formData.maxCapacity}
                                onChange={handleInputChange}
                                min="1"
                            />
                        </div>
                        <div className="form-group">
                            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleInputChange}
                                    style={{width: 'auto'}}
                                />
                                Evento Ativo
                            </label>
                        </div>
                        <button type="submit" className="btn btn-success">
                            {editingId ? '💾 Atualizar' : '➕ Criar Evento'}
                        </button>
                    </form>
                </div>
            )}
            
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">📋 Lista de Eventos</h3>
                    <span className="badge badge-info">{events.length} eventos</span>
                </div>
                {events.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🎉</div>
                        <h3 className="empty-state-title">Nenhum evento encontrado</h3>
                        <p className="empty-state-description">Crie seu primeiro evento para começar</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Local</th>
                                    <th>Início</th>
                                    <th>Fim</th>
                                    <th>Capacidade</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                    <tr key={event.id}>
                                        <td>
                                            <strong>{event.name}</strong>
                                            {event.description && (
                                                <div style={{fontSize: '12px', color: '#666'}}>
                                                    {event.description}
                                                </div>
                                            )}
                                        </td>
                                        <td>📍 {event.location}</td>
                                        <td>{formatDateTime(event.startTime)}</td>
                                        <td>{formatDateTime(event.endTime)}</td>
                                        <td>{event.maxCapacity}</td>
                                        <td>
                                            <span className={`badge ${event.active ? 'badge-success' : 'badge-danger'}`}>
                                                {event.active ? '✅ Ativo' : '❌ Inativo'}
                                            </span>
                                            {event.finished && (
                                                <span 
                                                    className="badge badge-info"
                                                    style={{marginLeft: '5px', padding: '4px 8px'}}
                                                >
                                                    ✅ Finalizado
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {isAdmin ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleEdit(event)} 
                                                        className="btn btn-primary btn-sm"
                                                        style={{marginRight: '5px'}}
                                                    >
                                                        ✏️ Editar
                                                    </button>
                                                    <button 
                                                        onClick={() => handleToggleStatus(event.id)} 
                                                        className={`btn ${event.active ? 'btn-warning' : 'badge-success'} btn-sm`}
                                                        style={{marginRight: '5px'}}
                                                    >
                                                        {event.active ? '⏸️ Desativar' : '▶️ Ativar'}
                                                    </button>
                                                    {event.active && !event.finished && (
                                                        <button 
                                                            onClick={() => handleFinishEvent(event.id)} 
                                                            className="btn btn-success btn-sm"
                                                            style={{marginRight: '5px'}}
                                                            title="Finalizar evento e gerar certificados"
                                                        >
                                                            🎓 Finalizar
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDelete(event.id)} 
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        🗑️ Deletar
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={() => handleRegisterToEvent(event.id)}
                                                    className="btn btn-success btn-sm"
                                                    disabled={!event.active || event.finished || loading}
                                                    title="Inscrever-se neste evento"
                                                >
                                                    {event.active && !event.finished ? '🎫 Inscrever-se' : '🚫 Indisponível'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventsPage;
