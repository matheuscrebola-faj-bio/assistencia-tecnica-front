import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import './CrudPage.css';

const Equipamentos = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    produto: '',
    serial: '',
    descricao: '',
    ultimaCalibracao: '',
    clienteId: ''
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get('/equipments');
      setItems(response.data);
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/equipments/${id}`);
      setSelectedItem(response.data);
      setFormData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar equipamento:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este equipamento?')) {
      try {
        await api.delete(`/equipments/${id}`);
        loadItems();
      } catch (error) {
        console.error('Erro ao excluir equipamento:', error);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem?.id) {
        await api.put(`/equipments/${selectedItem.id}`, formData);
      } else {
        await api.post('/equipments', formData);
      }
      setIsModalOpen(false);
      loadItems();
      setFormData({ produto: '', serial: '', descricao: '', ultimaCalibracao: '', clienteId: '' });
    } catch (error) {
      console.error('Erro ao salvar equipamento:', error);
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
    setFormData({ produto: '', serial: '', descricao: '', ultimaCalibracao: '', clienteId: '' });
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <h1>Equipamentos</h1>
          <button className="btn-primary" onClick={openNewModal}>
            + Novo Equipamento
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
                  <th>Produto</th>
                  <th>Serial</th>
                  <th>Descrição</th>
                  <th>Última Calibração</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      Nenhum equipamento cadastrado
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.produto}</td>
                      <td>{item.serial}</td>
                      <td>{item.descricao}</td>
                      <td>{item.ultimaCalibracao}</td>
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
          title={selectedItem ? 'Editar Equipamento' : 'Novo Equipamento'}
        >
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Produto *</label>
              <input
                type="text"
                name="produto"
                value={formData.produto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Serial *</label>
              <input
                type="text"
                name="serial"
                value={formData.serial}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Descrição *</label>
              <input
                type="text"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Última Calibração *</label>
              <input
                type="date"
                name="ultimaCalibracao"
                value={formData.ultimaCalibracao}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>ID do Cliente</label>
              <input
                type="number"
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
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

export default Equipamentos;
