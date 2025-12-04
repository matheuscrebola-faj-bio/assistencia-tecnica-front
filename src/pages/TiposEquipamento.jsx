import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import './CrudPage.css';

const TiposEquipamento = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: ''
  });

  // Lista de tipos de equipamento disponíveis (EProductLine)
  const productLines = [
    'MCA_PLUS_1811',
    'MCA_PLUS_1878'
  ];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get('/equipment-types');
      setItems(response.data);
    } catch (error) {
      console.error('Erro ao carregar tipos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/equipment-types/${id}`);
      setSelectedItem(response.data);
      setFormData({
        nome: response.data.nome || ''
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar tipo:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este tipo?')) {
      try {
        await api.delete(`/equipment-types/${id}`);
        loadItems();
      } catch (error) {
        console.error('Erro ao excluir tipo:', error);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem?.id) {
        await api.put(`/equipment-types/${selectedItem.id}`, formData);
      } else {
        await api.post('/equipment-types', formData);
      }
      setIsModalOpen(false);
      loadItems();
      setFormData({ nome: '' });
    } catch (error) {
      console.error('Erro ao salvar tipo:', error);
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
    setFormData({ nome: '' });
    setIsModalOpen(true);
  };

  const formatProductLine = (nome) => {
    if (!nome) return '-';
    return nome.replace(/_/g, ' ');
  };

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <h1>Tipos de Equipamento</h1>
          <button className="btn-primary" onClick={openNewModal}>
            + Novo Tipo
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
                  <th>Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center' }}>
                      Nenhum tipo cadastrado
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{formatProductLine(item.nome)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(item.id)}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(item.id)}
                          >
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
          title={selectedItem ? 'Editar Tipo' : 'Novo Tipo de Equipamento'}
        >
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Linha de Produto *</label>
              <select
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um tipo</option>
                {productLines.map((line) => (
                  <option key={line} value={line}>
                    {line.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsModalOpen(false)}
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

export default TiposEquipamento;
