import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    clientes: 219,
    equipamentos: 0,
    recebimentos: 0,
    faturas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <p className="subtitle">Bem-vindo ao sistema FAJ BIO</p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Clientes</h3>
              <p className="stat-number">{loading ? '...' : stats.clientes}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔧</div>
            <div className="stat-content">
              <h3>Equipamentos</h3>
              <p className="stat-number">{loading ? '...' : stats.equipamentos}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>Recebimentos</h3>
              <p className="stat-number">{loading ? '...' : stats.recebimentos}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Faturas</h3>
              <p className="stat-number">{loading ? '...' : stats.faturas}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-info">
          <h2>Sistema de Assistência Técnica</h2>
          <p>
            Gerencie clientes, equipamentos, recebimentos, faturas e muito mais através do menu lateral.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
