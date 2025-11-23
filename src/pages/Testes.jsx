import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import './CrudPage.css';

const Testes = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    equipamentoId: '',
    tipoTeste: '',
    dataTeste: '',
    resultado: '',
    observacoes: ''
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get('/testes');
      setItems(response.data);
    } catch (error) {
      console.error('Erro ao carregar testes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/testes/${id}`);
      setSelectedItem(response.data);
      setFormData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar teste:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este teste?')) {
      try {
        await api.delete(`/testes/${id}`);
        loadItems();
      } catch (error) {
        console.error('Erro ao excluir teste:', error);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem?.id) {
        await api.put(`/testes/${selectedItem.id}`, formData);
      } else {
        await api.post('/testes', formData);
      }
      setIsModalOpen(false);
      loadItems();
      setFormData({ equipamentoId: '', tipoTeste: '', dataTeste: '', resultado: '', observacoes: '' });
    } catch (error) {
      console.error('Erro ao salvar teste:', error);
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
    setFormData({ equipamentoId: '', tipoTeste: '', dataTeste: '', resultado: '', observacoes: '' });
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <h1>Testes</h1>
          <button className="btn-primary" onClick={openNewModal}>
            + Novo Teste
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
                  <th>Tipo de Teste</th>
                  <th>Data</th>
                  <th>Resultado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      Nenhum teste cadastrado
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.equipamentoId}</td>
                      <td>{item.tipoTeste}</td>
                      <td>{item.dataTeste}</td>
                      <td>{item.resultado}</td>
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
          title={selectedItem ? 'Editar Teste' : 'Novo Teste'}
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
              <label>Tipo de Teste *</label>
              <input
                type="text"
                name="tipoTeste"
                value={formData.tipoTeste}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Data do Teste *</label>
              <input
                type="date"
                name="dataTeste"
                value={formData.dataTeste}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Resultado *</label>
              <select name="resultado" value={formData.resultado} onChange={handleChange} required>
                <option value="">Selecione</option>
                <option value="APROVADO">Aprovado</option>
                <option value="REPROVADO">Reprovado</option>
                <option value="PARCIAL">Parcial</option>
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

export default Testes;
