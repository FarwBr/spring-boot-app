import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/paymentService';

function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            setLoading(true);
            const data = await paymentService.getAllPayments();
            setPayments(data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar pagamentos');
        } finally {
            setLoading(false);
        }
    };

    const handleProcess = async (id) => {
        try {
            await paymentService.processPayment(id);
            loadPayments();
        } catch (err) {
            setError('Erro ao processar pagamento');
        }
    };

    const handleComplete = async (id) => {
        try {
            await paymentService.completePayment(id);
            loadPayments();
        } catch (err) {
            setError('Erro ao completar pagamento');
        }
    };

    const handleFail = async (id) => {
        try {
            await paymentService.failPayment(id);
            loadPayments();
        } catch (err) {
            setError('Erro ao marcar pagamento como falho');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: { class: 'badge-warning', label: '⏳ Pendente' },
            PROCESSING: { class: 'badge-info', label: '⚙️ Processando' },
            COMPLETED: { class: 'badge-success', label: '✅ Completo' },
            FAILED: { class: 'badge-danger', label: '❌ Falhou' },
            REFUNDED: { class: 'badge-info', label: '↩️ Reembolsado' }
        };
        return badges[status] || { class: 'badge-info', label: status };
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Carregando pagamentos...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>💳 Gerenciamento de Pagamentos</h2>
                <p>Processe e acompanhe todos os pagamentos</p>
            </div>
            
            {error && <div className="alert alert-error">{error}</div>}
            
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">📋 Lista de Pagamentos</h3>
                    <span className="badge badge-info">{payments.length} pagamentos</span>
                </div>
                {payments.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">💳</div>
                        <h3 className="empty-state-title">Nenhum pagamento encontrado</h3>
                        <p className="empty-state-description">Os pagamentos aparecerão aqui quando forem criados</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Pedido ID</th>
                                    <th>Usuário ID</th>
                                    <th>Valor</th>
                                    <th>Método</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(payment => {
                                    const badge = getStatusBadge(payment.status);
                                    return (
                                        <tr key={payment.id}>
                                            <td>{payment.id}</td>
                                            <td>{payment.orderId}</td>
                                            <td>{payment.userId}</td>
                                            <td>R$ {parseFloat(payment.amount).toFixed(2)}</td>
                                            <td>{payment.paymentMethod}</td>
                                            <td>
                                                <span className={`badge ${badge.class}`}>
                                                    {badge.label}
                                                </span>
                                            </td>
                                            <td>
                                                {payment.status === 'PENDING' && (
                                                    <button 
                                                        onClick={() => handleProcess(payment.id)} 
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        ⚙️ Processar
                                                    </button>
                                                )}
                                                {payment.status === 'PROCESSING' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleComplete(payment.id)} 
                                                            className="btn btn-success btn-sm"
                                                            style={{marginRight: '8px'}}
                                                        >
                                                            ✅ Completar
                                                        </button>
                                                        <button 
                                                            onClick={() => handleFail(payment.id)} 
                                                            className="btn btn-danger btn-sm"
                                                        >
                                                            ❌ Falhar
                                                        </button>
                                                    </>
                                                )}
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

export default PaymentsPage;
