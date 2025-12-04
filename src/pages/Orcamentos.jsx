import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import './CrudPage.css';
import './Orcamentos.css';

const Orcamentos = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quoteItems, setQuoteItems] = useState([]);
  const [services, setServices] = useState([]);
  
  const [formData, setFormData] = useState({
    quoteItemReq: [],
    tipoQuoteEvent: 'CRIACAO',
    descricao: ''
  });

  const [itemFormData, setItemFormData] = useState({
    name: '',
    descricao: '',
    quantidade: 1
  });

  useEffect(() => {
    loadItems();
    loadServices();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get('/quotes');
      setItems(response.data);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    }
  };

  const loadQuoteItems = async (quoteId) => {
    try {
      const response = await api.get(`/quotes/${quoteId}/items`);
      setQuoteItems(response.data);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    }
  };

  const handleViewItems = async (item) => {
    setSelectedItem(item);
    await loadQuoteItems(item.id);
    setIsItemsModalOpen(true);
  };

  const handleApprove = async (id) => {
    if (window.confirm('Deseja aprovar este orçamento?')) {
      try {
        await api.post(`/quotes/${id}/approve`);
        loadItems();
      } catch (error) {
        console.error('Erro ao aprovar orçamento:', error);
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Deseja rejeitar este orçamento?')) {
      try {
        await api.post(`/quotes/${id}/reject`);
        loadItems();
      } catch (error) {
        console.error('Erro ao rejeitar orçamento:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este orçamento?')) {
      try {
        await api.delete(`/quotes/${id}`);
        loadItems();
      } catch (error) {
        console.error('Erro ao excluir orçamento:', error);
      }
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/quotes/${selectedItem.id}/items`, itemFormData);
      loadQuoteItems(selectedItem.id);
      setItemFormData({ name: '', descricao: '', quantidade: 1 });
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Deseja remover este item?')) {
      try {
        await api.delete(`/quotes/${selectedItem.id}/items/${itemId}`);
        loadQuoteItems(selectedItem.id);
      } catch (error) {
        console.error('Erro ao remover item:', error);
      }
    }
  };

  const handleItemChange = (e) => {
    setItemFormData({
      ...itemFormData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'RASCUNHO': 'badge-rascunho',
      'ENVIADO': 'badge-enviado',
      'APROVADO': 'badge-aprovado',
      'REJEITADO': 'badge-rejeitado',
      'EXPIRADO': 'badge-expirado'
    };
    return statusMap[status] || 'badge-default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <h1>Orçamentos</h1>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Validade</th>
                  <th>Revisão</th>
                  <th>Criado Em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      Nenhum orçamento cadastrado
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{formatDate(item.validade)}</td>
                      <td>{item.revision}</td>
                      <td>{formatDate(item.criadoEm)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-view"
                            onClick={() => handleViewItems(item)}
                          >
                            📋 Itens
                          </button>
                          {item.status === 'RASCUNHO' && (
                            <>
                              <button
                                className="btn-approve"
                                onClick={() => handleApprove(item.id)}
                              >
                                ✅ Aprovar
                              </button>
                              <button
                                className="btn-reject"
                                onClick={() => handleReject(item.id)}
                              >
                                ❌ Rejeitar
                              </button>
                            </>
                          )}
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

        {/* Modal de Itens do Orçamento */}
        <Modal
          isOpen={isItemsModalOpen}
          onClose={() => setIsItemsModalOpen(false)}
          title={`Itens do Orçamento #${selectedItem?.id}`}
        >
          <div className="quote-items-section">
            <h3>Itens Atuais</h3>
            {quoteItems.length === 0 ? (
              <p className="no-items">Nenhum item adicionado</p>
            ) : (
              <table className="items-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {quoteItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.descricao}</td>
                      <td>
                        <button
                          className="btn-delete-small"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h3 style={{ marginTop: '20px' }}>Adicionar Item</h3>
            <form onSubmit={handleAddItem}>
              <div className="form-group">
                <label>Serviço *</label>
                <select
                  name="name"
                  value={itemFormData.name}
                  onChange={handleItemChange}
                  required
                >
                  <option value="">Selecione um serviço</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.nome}>
                      {s.nome} - R$ {s.precoBase}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <input
                  type="text"
                  name="descricao"
                  value={itemFormData.descricao}
                  onChange={handleItemChange}
                  placeholder="Descrição adicional..."
                />
              </div>

              <div className="form-group">
                <label>Quantidade *</label>
                <input
                  type="number"
                  name="quantidade"
                  value={itemFormData.quantidade}
                  onChange={handleItemChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsItemsModalOpen(false)}
                >
                  Fechar
                </button>
                <button type="submit" className="btn-primary">
                  Adicionar Item
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Orcamentos;
