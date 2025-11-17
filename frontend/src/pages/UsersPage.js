import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar usuários');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (userData) => {
        try {
            if (editingUser) {
                await userService.updateUser(editingUser.id, userData);
            } else {
                await userService.createUser(userData);
            }
            setEditingUser(null);
            loadUsers();
        } catch (err) {
            setError('Erro ao salvar usuário');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
            try {
                await userService.deleteUser(id);
                loadUsers();
            } catch (err) {
                setError('Erro ao deletar usuário');
                console.error(err);
            }
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Carregando usuários...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>👥 Gerenciamento de Usuários</h2>
                <p>Cadastre, edite e gerencie todos os usuários do sistema</p>
            </div>
            
            {error && <div className="alert alert-error">{error}</div>}
            
            <div className="card mb-4">
                <div className="card-header">
                    <h3 className="card-title">
                        {editingUser ? '✏️ Editar Usuário' : '➕ Novo Usuário'}
                    </h3>
                </div>
                <UserForm 
                    onSubmit={handleCreateOrUpdate}
                    initialData={editingUser || {}}
                />
                {editingUser && (
                    <button onClick={handleCancelEdit} className="btn btn-secondary w-full mt-2">
                        ❌ Cancelar Edição
                    </button>
                )}
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">📋 Lista de Usuários</h3>
                    <span className="badge badge-info">{users.length} usuários</span>
                </div>
                {users.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">👤</div>
                        <h3 className="empty-state-title">Nenhum usuário cadastrado</h3>
                        <p className="empty-state-description">Comece adicionando um novo usuário acima</p>
                    </div>
                ) : (
                    <UserList 
                        users={users}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
}

export default UsersPage;
