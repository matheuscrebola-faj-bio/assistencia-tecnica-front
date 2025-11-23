import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import './CrudPage.css';

const Faturas = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    clienteId: '',
    valor: '',
    dataEmissao: '',
    dataVencimento: '',
    status: 'PENDENTE'
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get('/quotes');
      setItems(response.data);
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/quotes/${id}`);
      setSelectedItem(response.data);
      setFormData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar fatura:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta fatura?')) {
      try {
        await api.delete(`/quotes/${id}`);
        loadItems();
      } catch (error) {
        console.error('Erro ao excluir fatura:', error);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem?.id) {
        await api.put(`/quotes/${selectedItem.id}`, formData);
      } else {
        await api.post('/quotes', formData);
      }
      setIsModalOpen(false);
      loadItems();
      setFormData({ clienteId: '', valor: '', dataEmissao: '', dataVencimento: '', status: 'PENDENTE' });
    } catch (error) {
      console.error('Erro ao salvar fatura:', error);
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
    setFormData({ clienteId: '', valor: '', dataEmissao: '', dataVencimento: '', status: 'PENDENTE' });
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <h1>Faturas</h1>
          <button className="btn-primary" onClick={openNewModal}>
            + Nova Fatura
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
                  <th>Cliente ID</th>
                  <th>Valor</th>
                  <th>Data Emissão</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                      Nenhuma fatura cadastrada
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.clienteId}</td>
                      <td>R$ {item.valor}</td>
                      <td>{item.dataEmissao}</td>
                      <td>{item.dataVencimento}</td>
                      <td>{item.status}</td>
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
          title={selectedItem ? 'Editar Fatura' : 'Nova Fatura'}
        >
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>ID do Cliente *</label>
              <input
                type="number"
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Valor *</label>
              <input
                type="number"
                step="0.01"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Data de Emissão *</label>
              <input
                type="date"
                name="dataEmissao"
                value={formData.dataEmissao}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Data de Vencimento *</label>
              <input
                type="date"
                name="dataVencimento"
                value={formData.dataVencimento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="PENDENTE">Pendente</option>
                <option value="PAGA">Paga</option>
                <option value="VENCIDA">Vencida</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
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

export default Faturas;
