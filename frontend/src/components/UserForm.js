import React, { useState } from 'react';

function UserForm({ onSubmit, initialData = {} }) {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        email: initialData.email || '',
        cpf: initialData.cpf || '',
        phone: initialData.phone || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        if (!initialData.id) {
            setFormData({ name: '', email: '', cpf: '', phone: '' });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>📝 Nome Completo</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: João Silva"
                    required
                />
            </div>
            <div className="form-group">
                <label>📧 E-mail</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="joao@example.com"
                    required
                />
            </div>
            <div className="form-group">
                <label>🆔 CPF</label>
                <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    required
                />
            </div>
            <div className="form-group">
                <label>📞 Telefone</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(11) 98765-4321"
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary w-full">
                {initialData.id ? '✅ Atualizar Usuário' : '➕ Criar Usuário'}
            </button>
        </form>
    );
}

export default UserForm;
