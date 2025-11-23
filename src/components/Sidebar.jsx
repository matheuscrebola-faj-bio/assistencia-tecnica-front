import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/clientes', label: 'Clientes', icon: '👥' },
    { path: '/equipamentos', label: 'Equipamentos', icon: '🔧' },
    { path: '/recebimentos', label: 'Recebimentos', icon: '📦' },
    { path: '/faturas', label: 'Faturas', icon: '💰' },
    { path: '/testes', label: 'Testes', icon: '🧪' },
    { path: '/remessa', label: 'Remessa', icon: '📤' },
    { path: '/usuarios', label: 'Usuários', icon: '👤' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>FAJ BIO</h2>
        <p>Assistência Técnica</p>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <button className="logout-btn" onClick={logout}>
        🚪 Sair
      </button>
    </div>
  );
};

export default Sidebar;
