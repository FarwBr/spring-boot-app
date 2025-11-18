import React, { useState } from 'react';
import UsersPage from './pages/UsersPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import PaymentsPage from './pages/PaymentsPage';
import NotificationsPage from './pages/NotificationsPage';
import EventsPage from './pages/EventsPage';
import ParticipantsPage from './pages/ParticipantsPage';
import MyEventsPage from './pages/MyEventsPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('users');

  const renderPage = () => {
    switch (currentPage) {
      case 'users':
        return <UsersPage />;
      case 'products':
        return <ProductsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'events':
        return <EventsPage />;
      case 'participants':
        return <ParticipantsPage />;
      case 'myevents':
        return <MyEventsPage />;
      default:
        return <UsersPage />;
    }
  };

  return (
    <div className="App">
      <nav>
        <h1>Sistema de Gerenciamento</h1>
        <div className="nav-buttons">
          <button 
            onClick={() => setCurrentPage('users')} 
            className={currentPage === 'users' ? 'active' : ''}
          >
            👥 Usuários
          </button>
          <button 
            onClick={() => setCurrentPage('products')} 
            className={currentPage === 'products' ? 'active' : ''}
          >
            📦 Produtos
          </button>
          <button 
            onClick={() => setCurrentPage('orders')} 
            className={currentPage === 'orders' ? 'active' : ''}
          >
            🛒 Pedidos
          </button>
          <button 
            onClick={() => setCurrentPage('payments')} 
            className={currentPage === 'payments' ? 'active' : ''}
          >
            💳 Pagamentos
          </button>
          <button 
            onClick={() => setCurrentPage('notifications')} 
            className={currentPage === 'notifications' ? 'active' : ''}
          >
            🔔 Notificações
          </button>
          <button 
            onClick={() => setCurrentPage('events')} 
            className={currentPage === 'events' ? 'active' : ''}
          >
            🎉 Eventos
          </button>
          <button 
            onClick={() => setCurrentPage('participants')} 
            className={currentPage === 'participants' ? 'active' : ''}
          >
            👤 Participantes
          </button>
          <button 
            onClick={() => setCurrentPage('myevents')} 
            className={currentPage === 'myevents' ? 'active' : ''}
          >
            🎫 Meus Eventos
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