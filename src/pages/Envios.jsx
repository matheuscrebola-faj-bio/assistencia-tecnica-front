import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import './CrudPage.css';
import './Envios.css';

const Envios = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [shipmentEvents, setShipmentEvents] = useState([]);
  
  const [formData, setFormData] = useState({
    transportadora: '',
    codigoRastreio: '',
    dataEnvio: '',
    mode: 'ENVIO'
  });

  const [eventFormData, setEventFormData] = useState({
    status: 'POSTADO',
    localizacao: ''
  });

  const shipmentModes = ['ENVIO', 'RETORNO', 'TROCA'];
  const eventStatuses = [
    'POSTADO',
    'EM_TRANSITO',
    'SAIU_PARA_ENTREGA',
    'ENTREGUE',
    'DEVOLVIDO',
    'EXTRAVIADO'
  ];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get('/shipments');
      setItems(response.data);
    } catch (error) {
      console.error('Erro ao carregar envios:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async (shipmentId) => {
    try {
      const response = await api.get(`/shipments/${shipmentId}/events`);
      setShipmentEvents(response.data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };

  const handleViewEvents = async (item) => {
    setSelectedItem(item);
    await loadEvents(item.id);
    setIsEventsModalOpen(true);
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/shipments/${id}`);
      setSelectedItem(response.data);
      setFormData({
        transportadora: response.data.transportadora || '',
        codigoRastreio: response.data.codigoRastreio || '',
        dataEnvio: response.data.dataEnvio || '',
        mode: response.data.mode || 'ENVIO'
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar envio:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem?.id) {
        await api.put(`/shipments/${selectedItem.id}`, formData);
      }
      setIsModalOpen(false);
      loadItems();
    } catch (error) {
      console.error('Erro ao salvar envio:', error);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/shipments/${selectedItem.id}/events`, eventFormData);
      loadEvents(selectedItem.id);
      setEventFormData({ status: 'POSTADO', localizacao: '' });
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEventChange = (e) => {
    setEventFormData({
      ...eventFormData,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getModeLabel = (mode) => {
    const labels = {
      'ENVIO': 'Envio',
      'RETORNO': 'Retorno',
      'TROCA': 'Troca'
    };
    return labels[mode] || mode;
  };

  const getStatusLabel = (status) => {
    const labels = {
      'POSTADO': 'Postado',
      'EM_TRANSITO': 'Em Trânsito',
      'SAIU_PARA_ENTREGA': 'Saiu para Entrega',
      'ENTREGUE': 'Entregue',
      'DEVOLVIDO': 'Devolvido',
      'EXTRAVIADO': 'Extraviado'
    };
    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    const classes = {
      'POSTADO': 'status-postado',
      'EM_TRANSITO': 'status-transito',
      'SAIU_PARA_ENTREGA': 'status-entrega',
      'ENTREGUE': 'status-entregue',
      'DEVOLVIDO': 'status-devolvido',
      'EXTRAVIADO': 'status-extraviado'
    };
    return classes[status] || '';
  };

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <h1>Envios</h1>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Transportadora</th>
                  <th>Código Rastreio</th>
                  <th>Data Envio</th>
                  <th>Tipo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      Nenhum envio cadastrado
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.transportadora}</td>
                      <td>
                        <code className="tracking-code">{item.codigoRastreio}</code>
                      </td>
                      <td>{formatDate(item.dataEnvio)}</td>
                      <td>
                        <span className={`mode-badge mode-${item.mode?.toLowerCase()}`}>
                          {getModeLabel(item.mode)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-events"
                            onClick={() => handleViewEvents(item)}
                          >
                            📍 Rastreio
                          </button>
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(item.id)}
                          >
                            ✏️ Editar
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

        {/* Modal de Eventos de Rastreio */}
        <Modal
          isOpen={isEventsModalOpen}
          onClose={() => setIsEventsModalOpen(false)}
          title={`Rastreio - ${selectedItem?.codigoRastreio}`}
        >
          <div className="events-section">
            <h3>Histórico de Rastreio</h3>
            {shipmentEvents.length === 0 ? (
              <p className="no-events">Nenhum evento registrado</p>
            ) : (
              <div className="timeline">
                {shipmentEvents.map((event, index) => (
                  <div key={event.id} className="timeline-item">
                    <div className={`timeline-dot ${getStatusClass(event.status)}`}></div>
                    <div className="timeline-content">
                      <span className={`event-status ${getStatusClass(event.status)}`}>
                        {getStatusLabel(event.status)}
                      </span>
                      <span className="event-location">{event.localizacao}</span>
                      <span className="event-date">{formatDateTime(event.dataHora)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h3 style={{ marginTop: '20px' }}>Adicionar Evento</h3>
            <form onSubmit={handleAddEvent}>
              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={eventFormData.status}
                  onChange={handleEventChange}
                  required
                >
                  {eventStatuses.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Localização *</label>
                <input
                  type="text"
                  name="localizacao"
                  value={eventFormData.localizacao}
                  onChange={handleEventChange}
                  placeholder="Ex: São Paulo - SP"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsEventsModalOpen(false)}
                >
                  Fechar
                </button>
                <button type="submit" className="btn-primary">
                  Adicionar Evento
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Modal de Edição */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Editar Envio"
        >
          <form onSubmit={handleSave}>
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
              <label>Data de Envio *</label>
              <input
                type="date"
                name="dataEnvio"
                value={formData.dataEnvio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo *</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                required
              >
                {shipmentModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {getModeLabel(mode)}
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

export default Envios;
