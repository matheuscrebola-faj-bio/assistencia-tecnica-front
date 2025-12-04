import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import './CrudPage.css';

const Componentes = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    peca: '',
    unidade: '',
    preco: ''
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get('/components');
      setItems(response.data);
    } catch (error) {
      console.error('Erro ao carregar componentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/components/${id}`);
      setSelectedItem(response.data);
      setFormData({
        peca: response.data.peca || '',
        unidade: response.data.unidade || '',
        preco: response.data.preco || ''
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar componente:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este componente?')) {
      try {
        await api.delete(`/components/${id}`);
        loadItems();
      } catch (error) {
        console.error('Erro ao excluir componente:', error);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem?.id) {
        await api.put(`/components/${selectedItem.id}`, formData);
      } else {
        await api.post('/components', formData);
      }
      setIsModalOpen(false);
      loadItems();
      setFormData({ peca: '', unidade: '', preco: '' });
    } catch (error) {
      console.error('Erro ao salvar componente:', error);
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
    setFormData({ peca: '', unidade: '', preco: '' });
    setIsModalOpen(true);
  };

  const filteredItems = items.filter(item =>
    item.peca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <h1>Catálogo de Componentes</h1>
          <button className="btn-primary" onClick={openNewModal}>
            + Novo Componente
          </button>
        </div>

        <div className="search-bar" style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Buscar peça..."
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
                  <th>Peça</th>
                  <th>Unidade</th>
                  <th>Preço</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      Nenhum componente encontrado
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.peca}</td>
                      <td>{item.unidade}</td>
                      <td>{formatCurrency(item.preco)}</td>
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
          title={selectedItem ? 'Editar Componente' : 'Novo Componente'}
        >
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Peça *</label>
              <input
                type="text"
                name="peca"
                value={formData.peca}
                onChange={handleChange}
                placeholder="Nome da peça/componente..."
                required
              />
            </div>

            <div className="form-group">
              <label>Unidade *</label>
              <input
                type="number"
                name="unidade"
                value={formData.unidade}
                onChange={handleChange}
                placeholder="Quantidade em estoque"
                required
              />
            </div>

            <div className="form-group">
              <label>Preço (R$) *</label>
              <input
                type="number"
                step="0.01"
                name="preco"
                value={formData.preco}
                onChange={handleChange}
                placeholder="0.00"
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

export default Componentes;
