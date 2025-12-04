import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import './CrudPage.css';
import './OrdensTrabalho.css';

const OrdensTrabalho = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [workLogs, setWorkLogs] = useState([]);
  
  const [formData, setFormData] = useState({
    observacoes: '',
    worklog: {
      evento: ''
    }
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get('/work-orders');
      setItems(response.data);
    } catch (error) {
      console.error('Erro ao carregar ordens de trabalho:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkLogs = async (workOrderId) => {
    try {
      const response = await api.get(`/work-orders/${workOrderId}/logs`);
      setWorkLogs(response.data);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    }
  };

  const handleViewLogs = async (item) => {
    setSelectedItem(item);
    await loadWorkLogs(item.id);
    setIsLogsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      observacoes: item.observacoes || '',
      worklog: { evento: '' }
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/work-orders/${selectedItem.id}`, formData);
      setIsEditModalOpen(false);
      loadItems();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleClose = async (id) => {
    const evento = prompt('Descreva o evento de encerramento:');
    if (evento) {
      try {
        await api.post(`/work-orders/${id}/close`, {
          observacoes: '',
          worklog: { evento }
        });
        loadItems();
      } catch (error) {
        console.error('Erro ao encerrar ordem:', error);
      }
    }
  };

  const handleDeleteLog = async (logId) => {
    if (window.confirm('Deseja remover este log?')) {
      try {
        await api.delete(`/work-orders/${selectedItem.id}/logs/${logId}`);
        loadWorkLogs(selectedItem.id);
      } catch (error) {
        console.error('Erro ao remover log:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'evento') {
      setFormData({
        ...formData,
        worklog: { evento: value }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <h1>Ordens de Trabalho</h1>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Técnico</th>
                  <th>Data Início</th>
                  <th>Data Fim</th>
                  <th>Observações</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      Nenhuma ordem de trabalho cadastrada
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.tecnico?.username || '-'}</td>
                      <td>{formatDateTime(item.dataInicio)}</td>
                      <td>
                        {item.dataFim ? (
                          <span className="status-concluido">
                            {formatDateTime(item.dataFim)}
                          </span>
                        ) : (
                          <span className="status-andamento">Em andamento</span>
                        )}
                      </td>
                      <td>{item.observacoes || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-logs"
                            onClick={() => handleViewLogs(item)}
                          >
                            📝 Logs
                          </button>
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(item)}
                          >
                            ✏️ Editar
                          </button>
                          {!item.dataFim && (
                            <button
                              className="btn-close-order"
                              onClick={() => handleClose(item.id)}
                            >
                              ✅ Encerrar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de Logs */}
        <Modal
          isOpen={isLogsModalOpen}
          onClose={() => setIsLogsModalOpen(false)}
          title={`Logs da Ordem #${selectedItem?.id}`}
        >
          <div className="logs-section">
            {workLogs.length === 0 ? (
              <p className="no-logs">Nenhum log registrado</p>
            ) : (
              <div className="logs-list">
                {workLogs.map((log) => (
                  <div key={log.id} className="log-item">
                    <div className="log-content">
                      <span className="log-id">#{log.id}</span>
                      <span className="log-evento">{log.evento}</span>
                    </div>
                    <button
                      className="btn-delete-small"
                      onClick={() => handleDeleteLog(log.id)}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>

        {/* Modal de Edição */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Editar Ordem #${selectedItem?.id}`}
        >
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Observações</label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                rows="3"
                placeholder="Observações sobre o trabalho..."
              />
            </div>

            <div className="form-group">
              <label>Novo Evento/Log *</label>
              <input
                type="text"
                name="evento"
                value={formData.worklog.evento}
                onChange={handleChange}
                placeholder="Descreva a atividade realizada..."
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default OrdensTrabalho;
