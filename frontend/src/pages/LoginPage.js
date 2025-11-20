import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const API_URL = 'http://177.44.248.75:8081/api';

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            // Salvar token e dados do usuário
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role
            }));

            onLogin(response.data);
        } catch (err) {
            setError(err.response?.data || 'Email ou senha inválidos');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const name = e.target.name.value;
        const phone = e.target.phone.value;
        const company = e.target.company.value;

        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name,
                email,
                password,
                phone,
                company,
                role: 'CLIENT'
            });

            // Salvar token e dados do usuário
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role
            }));

            onLogin(response.data);
        } catch (err) {
            setError(err.response?.data || 'Erro ao criar conta');
        } finally {
            setLoading(false);
        }
    };

    if (showRegister) {
        return (
            <div className="login-page">
                <div className="login-container">
                    <h1>📝 Criar Conta</h1>
                    
                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="login-form">
                        <div className="form-group">
                            <label>Nome Completo:</label>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="João Silva"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>Senha:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="6"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        <div className="form-group">
                            <label>Telefone (opcional):</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="(51) 99999-9999"
                            />
                        </div>

                        <div className="form-group">
                            <label>Empresa (opcional):</label>
                            <input
                                type="text"
                                name="company"
                                placeholder="Nome da empresa"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Criando conta...' : 'Criar Conta'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Já tem uma conta? <button onClick={() => setShowRegister(false)} className="link-button">Fazer login</button></p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>🎫 Sistema de Eventos</h1>
                <h2>🔐 Login</h2>
                
                {error && (
                    <div className="error-message">
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seu@email.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label>Senha:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Digite sua senha"
                            autoComplete="current-password"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Não tem uma conta? <button onClick={() => setShowRegister(true)} className="link-button">Cadastre-se</button></p>
                </div>

                <div className="demo-credentials">
                    <h3>🔑 Acesso Admin de Teste</h3>
                    <p><strong>Email:</strong> admin@example.com</p>
                    <p><strong>Senha:</strong> admin123</p>
                </div>

                <div className="demo-credentials" style={{marginTop: '20px', borderColor: '#6366f1'}}>
                    <h3>🎓 Validar Certificado</h3>
                    <p>Recebeu um certificado? Valide sua autenticidade!</p>
                    <a 
                        href="/validate" 
                        className="btn btn-secondary"
                        style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#6366f1',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            marginTop: '10px'
                        }}
                    >
                        🔍 Validar Certificado
                    </a>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
