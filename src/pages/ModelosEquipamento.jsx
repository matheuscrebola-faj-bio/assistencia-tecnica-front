import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import './CrudPage.css';

const ModelosEquipamento = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    equipmentType: { nome: '' },
    fabricante: '',
    modelo: ''
  });

  const productLines = [
    'MCA_PLUS_1811',
    'MCA_PLUS_1878',
    'BANHO_MARIA',
    'ESTUFA',
    'CENTRIFUGA',
    'AUTOCLAVE',
    'AGITADOR',
    'BALANCA',
    'PHMETRO',
    'TERMOMETRO',
    'CRONOMETRO',
    'OUTRO'
  ];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get('/equipment-models');
      setItems(response.data);
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/equipment-models/${id}`);
      setSelectedItem(response.data);
      setFormData({
        equipmentType: { nome: '' },
        fabricante: response.data.fabricante || '',
        modelo: response.data.modelo || ''
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar modelo:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este modelo?')) {
      try {
        await api.delete(`/equipment-models/${id}`);
        loadItems();
      } catch (error) {
        console.error('Erro ao excluir modelo:', error);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem?.id) {
        await api.put(`/equipment-models/${selectedItem.id}`, formData);
      } else {
        await api.post('/equipment-models', formData);
      }
      setIsModalOpen(false);
      loadItems();
      setFormData({ equipmentType: { nome: '' }, fabricante: '', modelo: '' });
    } catch (error) {
      console.error('Erro ao salvar modelo:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tipoEquipamento') {
      setFormData({
        ...formData,
        equipmentType: { nome: value }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const openNewModal = () => {
    setSelectedItem(null);
    setFormData({ equipmentType: { nome: '' }, fabricante: '', modelo: '' });
    setIsModalOpen(true);
  };

  const filteredItems = items.filter(item =>
    item.fabricante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.modelo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <h1>Modelos de Equipamento</h1>
          <button className="btn-primary" onClick={openNewModal}>
            + Novo Modelo
          </button>
        </div>

        <div className="search-bar" style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Buscar por fabricante ou modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fabricante</th>
                  <th>Modelo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                      Nenhum modelo encontrado
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.fabricante}</td>
                      <td>{item.modelo}</td>
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
          title={selectedItem ? 'Editar Modelo' : 'Novo Modelo de Equipamento'}
        >
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Tipo de Equipamento *</label>
              <select
                name="tipoEquipamento"
                value={formData.equipmentType.nome}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o tipo</option>
                {productLines.map((line) => (
                  <option key={line} value={line}>
                    {line.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Fabricante *</label>
              <input
                type="text"
                name="fabricante"
                value={formData.fabricante}
                onChange={handleChange}
                placeholder="Nome do fabricante..."
                required
              />
            </div>

            <div className="form-group">
              <label>Modelo *</label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                placeholder="Código/Nome do modelo..."
                required
              />
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

export default ModelosEquipamento;
