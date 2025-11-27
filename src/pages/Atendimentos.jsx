import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import './CrudPage.css';
import './Atendimentos.css';

const Atendimentos = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSolucaoModalOpen, setIsSolucaoModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [editFormData, setEditFormData] = useState({
    nomeContato: '',
    telefone: '',
    email: '',
    produto: '',
    numeroSerie: '',
    observacoes: ''
  });

  const [solucaoFormData, setSolucaoFormData] = useState({
    resolucao: ''
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get('/atendimentos');
      setItems(response.data);
    } catch (error) {
      console.error('Erro ao carregar atendimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/atendimentos/${id}`);
      setSelectedItem(response.data);
      setEditFormData({
        nomeContato: response.data.nomeContato || '',
        telefone: response.data.telefone || '',
        email: response.data.email || '',
        produto: response.data.produto || '',
        numeroSerie: response.data.numeroSerie || '',
        observacoes: response.data.observacoes || ''
      });
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar atendimento:', error);
    }
  };

  const handleOpenSolucao = (item) => {
    setSelectedItem(item);
    setSolucaoFormData({ resolucao: '' });
    setIsSolucaoModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/atendimentos/${selectedItem.id}`, editFormData);
      setIsEditModalOpen(false);
      loadItems();
      setEditFormData({
        nomeContato: '',
        telefone: '',
        email: '',
        produto: '',
        numeroSerie: '',
        observacoes: ''
      });
    } catch (error) {
      console.error('Erro ao salvar atendimento:', error);
    }
  };

  const handleSaveSolucao = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/atendimentos/${selectedItem.id}/solucao`, solucaoFormData);
      setIsSolucaoModalOpen(false);
      loadItems();
      setSolucaoFormData({ resolucao: '' });
    } catch (error) {
      console.error('Erro ao registrar solução:', error);
    }
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSolucaoChange = (e) => {
    setSolucaoFormData({
      ...solucaoFormData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <h1>Atendimentos</h1>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nº Atendimento</th>
                  <th>Data Abertura</th>
                  <th>Produto</th>
                  <th>Responsável</th>
                  <th>Data Encerramento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      Nenhum atendimento cadastrado
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.numeroAtendimento}</td>
                      <td>{item.dataAbertura}</td>
                      <td>{item.produto}</td>
                      <td>{item.responsavel}</td>
                      <td>{item.dataEncerramento || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(item.id)}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="btn-solucao"
                            onClick={() => handleOpenSolucao(item)}
                          >
                            ✅ Registrar Solução
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

        {/* Modal de Edição */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Editar Atendimento"
        >
          <form onSubmit={handleSaveEdit}>
            <div className="form-group">
              <label>Nome do Contato *</label>
              <input
                type="text"
                name="nomeContato"
                value={editFormData.nomeContato}
                onChange={handleEditChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Telefone *</label>
              <input
                type="text"
                name="telefone"
                value={editFormData.telefone}
                onChange={handleEditChange}
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div className="form-group">
              <label>E-mail *</label>
              <input
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Produto *</label>
              <input
                type="text"
                name="produto"
                value={editFormData.produto}
                onChange={handleEditChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Número de Série *</label>
              <input
                type="text"
                name="numeroSerie"
                value={editFormData.numeroSerie}
                onChange={handleEditChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Observações</label>
              <textarea
                name="observacoes"
                value={editFormData.observacoes}
                onChange={handleEditChange}
                rows="4"
                placeholder="Digite observações adicionais..."
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

        {/* Modal de Solução */}
        <Modal
          isOpen={isSolucaoModalOpen}
          onClose={() => setIsSolucaoModalOpen(false)}
          title="Registrar Solução"
        >
          <form onSubmit={handleSaveSolucao}>
            {selectedItem && (
              <div className="solucao-info">
                <p><strong>Atendimento:</strong> {selectedItem.numeroAtendimento}</p>
                <p><strong>Produto:</strong> {selectedItem.produto}</p>
              </div>
            )}

            <div className="form-group">
              <label>Resolução *</label>
              <textarea
                name="resolucao"
                value={solucaoFormData.resolucao}
                onChange={handleSolucaoChange}
                rows="6"
                placeholder="Descreva detalhadamente a solução aplicada..."
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsSolucaoModalOpen(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Salvar Solução
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Atendimentos;
