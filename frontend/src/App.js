import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import NotificationsPage from './pages/NotificationsPage';
import EventsPage from './pages/EventsPage';
import ParticipantsPage from './pages/ParticipantsPage';
import MyEventsPage from './pages/MyEventsPage';
import LogsPage from './pages/LogsPage';
import CertificateValidation from './pages/CertificateValidation';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [showPublicValidation, setShowPublicValidation] = useState(false);

  useEffect(() => {
    // Verificar se URL é para validação pública
    const path = window.location.pathname;
    if (path === '/validate' || path === '/validar') {
      setShowPublicValidation(true);
      return;
    }
    
    // Verificar se há usuário logado
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      setCurrentPage('events'); // Página inicial após login
    }
  }, []);

  // Página pública de validação
  if (showPublicValidation) {
    return <CertificateValidation />;
  }

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setCurrentPage('events');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="welcome-page">
            <h1>🎫 Bem-vindo ao Sistema de Eventos</h1>
            <p>Gerencie eventos, participantes e certificados em um só lugar.</p>
          </div>
        );
      case 'users':
        return <UsersPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'events':
        return <EventsPage />;
      case 'participants':
        return <ParticipantsPage />;
      case 'myevents':
        return <MyEventsPage />;
      case 'logs':
        return <LogsPage />;
      default:
        return (
          <div className="welcome-page">
            <h1>🎫 Bem-vindo ao Sistema de Eventos</h1>
            <p>Gerencie eventos, participantes e certificados em um só lugar.</p>
          </div>
        );
    }
  };

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Se estiver autenticado, mostrar dashboard
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="App">
      <nav>
        <h1>🎫 Sistema de Eventos</h1>
        <div className="user-info">
          <span>👤 {user?.name}</span>
          <span className="user-role">{isAdmin ? '👨‍💼 Admin' : '👨 Cliente'}</span>
        </div>
        <div className="nav-buttons">
          <button 
            onClick={() => setCurrentPage('home')} 
            className={currentPage === 'home' ? 'active' : ''}
          >
            🏠 Início
          </button>
          
          {isAdmin && (
            <button 
              onClick={() => setCurrentPage('users')} 
              className={currentPage === 'users' ? 'active' : ''}
            >
              👥 Usuários
            </button>
          )}
          
          <button 
            onClick={() => setCurrentPage('events')} 
            className={currentPage === 'events' ? 'active' : ''}
          >
            🎉 Eventos
          </button>
          
          {isAdmin && (
            <button 
              onClick={() => setCurrentPage('participants')} 
              className={currentPage === 'participants' ? 'active' : ''}
            >
              👤 Participantes
            </button>
          )}
          
          <button 
            onClick={() => setCurrentPage('myevents')} 
            className={currentPage === 'myevents' ? 'active' : ''}
          >
            🎫 Meus Eventos
          </button>
          
          <button 
            onClick={() => setCurrentPage('notifications')} 
            className={currentPage === 'notifications' ? 'active' : ''}
          >
            🔔 Notificações
          </button>
          
          {isAdmin && (
            <button 
              onClick={() => setCurrentPage('logs')} 
              className={currentPage === 'logs' ? 'active' : ''}
            >
              📊 Logs
            </button>
          )}
          
          <button 
            onClick={handleLogout} 
            className="btn-logout"
          >
            🚪 Sair
          </button>
        </div>
      </nav>
      <main className="container">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;