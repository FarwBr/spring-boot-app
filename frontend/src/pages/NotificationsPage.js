import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsed = JSON.parse(userData);
                setUser(parsed);
            } catch (e) {
                console.error('Erro ao ler usuário:', e);
            }
        }
    }, []);

    useEffect(() => {
        if (user?.id) {
            loadNotifications();
        }
    }, [user]);

    const loadNotifications = async () => {
        if (!user?.id) return;
        
        try {
            setLoading(true);
            const data = await notificationService.getNotificationsByUser(user.id);
            setNotifications(data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar notificações');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            loadNotifications();
        } catch (err) {
            setError('Erro ao marcar como lida');
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!user?.id) return;
        try {
            await notificationService.markAllAsRead(user.id);
            loadNotifications();
        } catch (err) {
            setError('Erro ao marcar todas como lidas');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar esta notificação?')) {
            try {
                await notificationService.deleteNotification(id);
                loadNotifications();
            } catch (err) {
                setError('Erro ao deletar notificação');
            }
        }
    };

    const getTypeBadge = (type) => {
        const badges = {
            CHECKIN_PERFORMED: { class: 'badge-success', icon: '✅', label: 'Check-in' },
            EVENT_REMINDER: { class: 'badge-warning', icon: '⏰', label: 'Lembrete' },
            EVENT_FINISHED: { class: 'badge-info', icon: '🎓', label: 'Evento Finalizado' },
            CERTIFICATE_READY: { class: 'badge-success', icon: '📜', label: 'Certificado' },
            EVENT_UPDATED: { class: 'badge-info', icon: '📝', label: 'Atualização' },
            EVENT_CANCELLED: { class: 'badge-danger', icon: '❌', label: 'Cancelamento' },
            SYSTEM: { class: 'badge-info', icon: '⚙️', label: 'Sistema' }
        };
        return badges[type] || { class: 'badge-info', icon: '🔔', label: 'Notificação' };
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.read;
        if (filter === 'read') return n.read;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Carregando notificações...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="page-header">
                <h2>🔔 Notificações</h2>
                <p style={{color: '#dc3545'}}>⚠️ Você precisa estar logado para ver suas notificações.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>🔔 Minhas Notificações</h2>
                <p>Acompanhe atualizações sobre seus eventos, check-ins e certificados</p>
            </div>
            
            {error && <div className="alert alert-error">{error}</div>}
            
            <div style={{marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center'}}>
                <button 
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('all')}
                >
                    🔔 Todas ({notifications.length})
                </button>
                <button 
                    className={`btn ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('unread')}
                >
                    📬 Não Lidas ({unreadCount})
                </button>
                <button 
                    className={`btn ${filter === 'read' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('read')}
                >
                    ✅ Lidas ({notifications.length - unreadCount})
                </button>
                {unreadCount > 0 && (
                    <button 
                        className="btn btn-success"
                        onClick={handleMarkAllAsRead}
                        style={{marginLeft: 'auto'}}
                    >
                        ✅ Marcar Todas como Lidas
                    </button>
                )}
            </div>
            
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">📋 {filter === 'all' ? 'Todas' : filter === 'unread' ? 'Não Lidas' : 'Lidas'}</h3>
                    <span className="badge badge-info">{filteredNotifications.length} notificações</span>
                </div>
                {filteredNotifications.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔔</div>
                        <h3 className="empty-state-title">Nenhuma notificação {filter === 'unread' ? 'não lida' : filter === 'read' ? 'lida' : ''}</h3>
                        <p className="empty-state-description">
                            {filter === 'unread' ? 'Você está em dia! 🎉' : 'As notificações aparecerão aqui'}
                        </p>
                    </div>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem'}}>
                        {filteredNotifications.map(notification => {
                            const typeBadge = getTypeBadge(notification.type);
                            return (
                                <div 
                                    key={notification.id} 
                                    style={{
                                        padding: '1.5rem',
                                        borderRadius: '0.75rem',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        backgroundColor: notification.read ? '#f9fafb' : '#ffffff',
                                        borderLeft: `4px solid var(--primary-color)`,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem'}}>
                                        <h3 style={{margin: 0, fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)'}}>
                                            {typeBadge.icon} {notification.message}
                                        </h3>
                                        <span className={`badge ${typeBadge.class}`}>
                                            {typeBadge.label}
                                        </span>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem'}}>
                                        <small style={{color: 'var(--text-secondary)'}}>
                                            🕐 {new Date(notification.createdAt).toLocaleString('pt-BR')}
                                        </small>
                                        <div style={{display: 'flex', gap: '0.5rem'}}>
                                            {!notification.read && (
                                                <button 
                                                    onClick={() => handleMarkAsRead(notification.id)} 
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    ✅ Marcar como lida
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(notification.id)} 
                                                className="btn btn-danger btn-sm"
                                            >
                                                🗑️ Deletar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotificationsPage;
