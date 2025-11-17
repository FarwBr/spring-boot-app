import React from 'react';

function UserList({ users, onEdit, onDelete }) {
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>CPF</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.cpf}</td>
                            <td>{user.phone}</td>
                            <td>
                                <button 
                                    onClick={() => onEdit(user)}
                                    className="btn btn-warning btn-sm"
                                    style={{marginRight: '8px'}}
                                >
                                    ✏️ Editar
                                </button>
                                <button 
                                    onClick={() => onDelete(user.id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    🗑️ Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserList;
