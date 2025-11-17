import React, { useState } from 'react';
import UsersPage from './pages/UsersPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import PaymentsPage from './pages/PaymentsPage';
import NotificationsPage from './pages/NotificationsPage';
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
        </div>
      </nav>
      <main className="container">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;