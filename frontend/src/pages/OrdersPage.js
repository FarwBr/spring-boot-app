import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getAllOrders();
            setOrders(data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar pedidos');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await orderService.updateOrderStatus(id, status);
            loadOrders();
        } catch (err) {
            setError('Erro ao atualizar status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este pedido?')) {
            try {
                await orderService.deleteOrder(id);
                loadOrders();
            } catch (err) {
                setError('Erro ao deletar pedido');
            }
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: { class: 'badge-warning', label: '⏳ Pendente' },
            CONFIRMED: { class: 'badge-info', label: '✅ Confirmado' },
            PROCESSING: { class: 'badge-info', label: '⚙️ Processando' },
            SHIPPED: { class: 'badge-info', label: '🚚 Enviado' },
            DELIVERED: { class: 'badge-success', label: '📦 Entregue' },
            CANCELLED: { class: 'badge-danger', label: '❌ Cancelado' }
        };
        return badges[status] || { class: 'badge-info', label: status };
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Carregando pedidos...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>🛒 Gerenciamento de Pedidos</h2>
                <p>Acompanhe e gerencie todos os pedidos do sistema</p>
            </div>
            
            {error && <div className="alert alert-error">{error}</div>}
            
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">📋 Lista de Pedidos</h3>
                    <span className="badge badge-info">{orders.length} pedidos</span>
                </div>
                {orders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🛒</div>
                        <h3 className="empty-state-title">Nenhum pedido encontrado</h3>
                        <p className="empty-state-description">Os pedidos aparecerão aqui quando forem criados</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuário ID</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Data</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => {
                                    const badge = getStatusBadge(order.status);
                                    return (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{order.userId}</td>
                                            <td>R$ {parseFloat(order.totalAmount).toFixed(2)}</td>
                                            <td>
                                                <span className={`badge ${badge.class}`}>
                                                    {badge.label}
                                                </span>
                                            </td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <select 
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    value={order.status}
                                                    className="btn btn-sm"
                                                    style={{marginRight: '8px', padding: '6px 12px'}}
                                                >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="PROCESSING">PROCESSING</option>
                                                    <option value="SHIPPED">SHIPPED</option>
                                                    <option value="DELIVERED">DELIVERED</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                </select>
                                                <button 
                                                    onClick={() => handleDelete(order.id)} 
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    🗑️ Deletar
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrdersPage;
