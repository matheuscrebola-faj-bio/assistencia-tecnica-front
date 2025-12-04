import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import './CrudPage.css';

const Remessa = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    equipamentoId: '',
    dataRemessa: '',
    transportadora: '',
    codigoRastreio: '',
    destino: ''
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get('/shipments');
      setItems(response.data);
    } catch (error) {
      console.error('Erro ao carregar remessas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/shipments/${id}`);
      setSelectedItem(response.data);
      setFormData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar remessa:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta remessa?')) {
      try {
        await api.delete(`/shipments/${id}`);
        loadItems();
      } catch (error) {
        console.error('Erro ao excluir remessa:', error);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem?.id) {
        await api.put(`/shipments/${selectedItem.id}`, formData);
      } else {
        await api.post('/shipments', formData);
      }
      setIsModalOpen(false);
      loadItems();
      setFormData({ equipamentoId: '', dataRemessa: '', transportadora: '', codigoRastreio: '', destino: '' });
    } catch (error) {
      console.error('Erro ao salvar remessa:', error);
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
    setFormData({ equipamentoId: '', dataRemessa: '', transportadora: '', codigoRastreio: '', destino: '' });
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <h1>Remessa</h1>
          <button className="btn-primary" onClick={openNewModal}>
            + Nova Remessa
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
                  <th>Data Remessa</th>
                  <th>Transportadora</th>
                  <th>Rastreio</th>
                  <th>Destino</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                      Nenhuma remessa cadastrada
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.equipamentoId}</td>
                      <td>{item.dataRemessa}</td>
                      <td>{item.transportadora}</td>
                      <td>{item.codigoRastreio}</td>
                      <td>{item.destino}</td>
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
          title={selectedItem ? 'Editar Remessa' : 'Nova Remessa'}
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
              <label>Data da Remessa *</label>
              <input
                type="date"
                name="dataRemessa"
                value={formData.dataRemessa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Transportadora *</label>
              <input
                type="text"
                name="transportadora"
                value={formData.transportadora}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Código de Rastreio *</label>
              <input
                type="text"
                name="codigoRastreio"
                value={formData.codigoRastreio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Destino *</label>
              <textarea
                name="destino"
                value={formData.destino}
                onChange={handleChange}
                rows="3"
                required
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

export default Remessa;
