import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getAllNotifications();
            setNotifications(data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar notificações');
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
            ORDER_STATUS: { class: 'badge-info', icon: '🛒', label: 'Pedido' },
            PAYMENT_STATUS: { class: 'badge-success', icon: '💳', label: 'Pagamento' },
            PROMOTION: { class: 'badge-warning', icon: '🎉', label: 'Promoção' },
            SYSTEM: { class: 'badge-info', icon: '⚙️', label: 'Sistema' }
        };
        return badges[type] || { class: 'badge-info', icon: '🔔', label: 'Geral' };
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Carregando notificações...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>🔔 Gerenciamento de Notificações</h2>
                <p>Visualize e gerencie todas as notificações do sistema</p>
            </div>
            
            {error && <div className="alert alert-error">{error}</div>}
            
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">📋 Lista de Notificações</h3>
                    <span className="badge badge-info">{notifications.length} notificações</span>
                </div>
                {notifications.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔔</div>
                        <h3 className="empty-state-title">Nenhuma notificação</h3>
                        <p className="empty-state-description">As notificações aparecerão aqui</p>
                    </div>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem'}}>
                        {notifications.map(notification => {
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
