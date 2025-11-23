import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import './CrudPage.css';

const Recebimentos = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    equipamentoId: '',
    dataRecebimento: '',
    observacoes: '',
    status: 'RECEBIDO'
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get('/invoices');
      setItems(response.data);
    } catch (error) {
      console.error('Erro ao carregar recebimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/invoices/${id}`);
      setSelectedItem(response.data);
      setFormData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar recebimento:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este recebimento?')) {
      try {
        await api.delete(`/invoices/${id}`);
        loadItems();
      } catch (error) {
        console.error('Erro ao excluir recebimento:', error);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem?.id) {
        await api.put(`/invoices/${selectedItem.id}`, formData);
      } else {
        await api.post('/invoices', formData);
      }
      setIsModalOpen(false);
      loadItems();
      setFormData({ equipamentoId: '', dataRecebimento: '', observacoes: '', status: 'RECEBIDO' });
    } catch (error) {
      console.error('Erro ao salvar recebimento:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openNewModal = () => {
    setSelectedItem(null);
    setFormData({ equipamentoId: '', dataRecebimento: '', observacoes: '', status: 'RECEBIDO' });
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <h1>Recebimentos</h1>
          <button className="btn-primary" onClick={openNewModal}>
            + Novo Recebimento
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Equipamento ID</th>
                  <th>Data Recebimento</th>
                  <th>Status</th>
                  <th>Observações</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      Nenhum recebimento cadastrado
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.equipamentoId}</td>
                      <td>{item.dataRecebimento}</td>
                      <td>{item.status}</td>
                      <td>{item.observacoes}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit" onClick={() => handleEdit(item.id)}>
                            ✏️ Editar
                          </button>
                          <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                            🗑️ Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedItem ? 'Editar Recebimento' : 'Novo Recebimento'}
        >
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>ID do Equipamento *</label>
              <input
                type="number"
                name="equipamentoId"
                value={formData.equipamentoId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Data de Recebimento *</label>
              <input
                type="date"
                name="dataRecebimento"
                value={formData.dataRecebimento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="RECEBIDO">Recebido</option>
                <option value="EM_ANALISE">Em Análise</option>
                <option value="EM_REPARO">Em Reparo</option>
                <option value="CONCLUIDO">Concluído</option>
              </select>
            </div>

            <div className="form-group">
              <label>Observações</label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
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

export default Recebimentos;
