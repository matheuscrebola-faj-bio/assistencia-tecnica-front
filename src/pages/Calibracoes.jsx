import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import './CrudPage.css';
import './Calibracoes.css';

const Calibracoes = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [calibrationPoints, setCalibrationPoints] = useState([]);
  
  const [formData, setFormData] = useState({
    data: '',
    referenciaCertificado: '',
    validade: ''
  });

  const [pointFormData, setPointFormData] = useState({
    grandeza: '',
    valorNominal: '',
    valorMedido: '',
    incerteza: ''
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      // Como não há endpoint para listar todas calibrações,
      // este componente pode ser integrado com service-orders
      const response = await api.get('/calibrations');
      setItems(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar calibrações:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPoints = async (calibrationId) => {
    try {
      const response = await api.get(`/calibrations/${calibrationId}/points`);
      setCalibrationPoints(response.data);
    } catch (error) {
      console.error('Erro ao carregar pontos:', error);
    }
  };

  const handleViewPoints = async (item) => {
    setSelectedItem(item);
    await loadPoints(item.id);
    setIsPointsModalOpen(true);
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/calibrations/${id}`);
      setSelectedItem(response.data);
      setFormData({
        data: response.data.data || '',
        referenciaCertificado: response.data.certificado || '',
        validade: response.data.validade || ''
      });
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar calibração:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/calibrations/${selectedItem.id}`, formData);
      setIsEditModalOpen(false);
      loadItems();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta calibração?')) {
      try {
        await api.delete(`/calibrations/${id}`);
        loadItems();
      } catch (error) {
        console.error('Erro ao excluir:', error);
      }
    }
  };

  const handleAddPoint = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/calibrations/${selectedItem.id}/points`, pointFormData);
      loadPoints(selectedItem.id);
      setPointFormData({
        grandeza: '',
        valorNominal: '',
        valorMedido: '',
        incerteza: ''
      });
    } catch (error) {
      console.error('Erro ao adicionar ponto:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePointChange = (e) => {
    setPointFormData({
      ...pointFormData,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isExpired = (validadeStr) => {
    if (!validadeStr) return false;
    return new Date(validadeStr) < new Date();
  };

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <h1>Calibrações</h1>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Certificado</th>
                  <th>Validade</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      Nenhuma calibração cadastrada
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{formatDate(item.data)}</td>
                      <td>{item.certificado || '-'}</td>
                      <td>{formatDate(item.validade)}</td>
                      <td>
                        {isExpired(item.validade) ? (
                          <span className="status-expirado">Expirado</span>
                        ) : (
                          <span className="status-valido">Válido</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-points"
                            onClick={() => handleViewPoints(item)}
                          >
                            📊 Pontos
                          </button>
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

        {/* Modal de Pontos de Calibração */}
        <Modal
          isOpen={isPointsModalOpen}
          onClose={() => setIsPointsModalOpen(false)}
          title={`Pontos de Calibração #${selectedItem?.id}`}
        >
          <div className="points-section">
            <h3>Pontos Medidos</h3>
            {calibrationPoints.length === 0 ? (
              <p className="no-points">Nenhum ponto registrado</p>
            ) : (
              <table className="points-table">
                <thead>
                  <tr>
                    <th>Grandeza</th>
                    <th>Valor Nominal</th>
                    <th>Valor Medido</th>
                    <th>Incerteza</th>
                  </tr>
                </thead>
                <tbody>
                  {calibrationPoints.map((point) => (
                    <tr key={point.id}>
                      <td>{point.grandeza}</td>
                      <td>{point.valorNominal}</td>
                      <td>{point.valorMedido}</td>
                      <td>±{point.incerteza}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h3 style={{ marginTop: '20px' }}>Adicionar Ponto</h3>
            <form onSubmit={handleAddPoint}>
              <div className="form-row">
                <div className="form-group">
                  <label>Grandeza *</label>
                  <input
                    type="text"
                    name="grandeza"
                    value={pointFormData.grandeza}
                    onChange={handlePointChange}
                    placeholder="Ex: Temperatura, Pressão..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Valor Nominal *</label>
                  <input
                    type="number"
                    step="0.0001"
                    name="valorNominal"
                    value={pointFormData.valorNominal}
                    onChange={handlePointChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Valor Medido *</label>
                  <input
                    type="number"
                    step="0.0001"
                    name="valorMedido"
                    value={pointFormData.valorMedido}
                    onChange={handlePointChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Incerteza *</label>
                  <input
                    type="number"
                    step="0.0001"
                    name="incerteza"
                    value={pointFormData.incerteza}
                    onChange={handlePointChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsPointsModalOpen(false)}
                >
                  Fechar
                </button>
                <button type="submit" className="btn-primary">
                  Adicionar Ponto
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Modal de Edição */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Editar Calibração"
        >
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Data *</label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Referência do Certificado *</label>
              <input
                type="text"
                name="referenciaCertificado"
                value={formData.referenciaCertificado}
                onChange={handleChange}
                placeholder="Número do certificado..."
                required
              />
            </div>

            <div className="form-group">
              <label>Validade *</label>
              <input
                type="date"
                name="validade"
                value={formData.validade}
                onChange={handleChange}
                required
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
      </div>
    </Layout>
  );
};

export default Calibracoes;
