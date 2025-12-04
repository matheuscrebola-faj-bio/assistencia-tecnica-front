import { useState } from 'react';
import axios from 'axios';
import './PublicForm.css';

const PublicForm = () => {
  const [formData, setFormData] = useState({
    empresa: '',
    cnpj: '',
    contato: '',
    setor: '',
    email: '',
    cep: '',
    endereco: '',
    produto: '',
    serial: '',
    ultimaCalibracao: '',
    descricao: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.post('http://localhost:8081/api/service-orders', formData);
      setMessage({ type: 'success', text: 'Solicitação enviada com sucesso!' });
      setFormData({
        empresa: '',
        cnpj: '',
        contato: '',
        setor: '',
        email: '',
        cep: '',
        endereco: '',
        produto: '',
        serial: '',
        ultimaCalibracao: '',
        descricao: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao enviar solicitação. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-form-container">
      <div className="public-form-box">
        <div className="form-header">
          <h1>FAJ BIO - Assistência Técnica</h1>
          <p>Solicite assistência técnica para seus equipamentos</p>
        </div>

        <form onSubmit={handleSubmit} className="public-form">
          <div className="form-row">
            <div className="form-group">
              <label>Empresa *</label>
              <input
                type="text"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>CNPJ *</label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contato *</label>
              <input
                type="text"
                name="contato"
                value={formData.contato}
                onChange={handleChange}
                placeholder="(00) 0000-0000"
                required
              />
            </div>
            <div className="form-group">
              <label>Setor *</label>
              <input
                type="text"
                name="setor"
                value={formData.setor}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>E-mail *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CEP *</label>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                placeholder="00000-000"
                required
              />
            </div>
            <div className="form-group">
              <label>Endereço *</label>
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-row">
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
              <label>Descrição do Equipamento *</label>
              <input
                type="text"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Solicitação'}
          </button>
        </form>

        <div className="form-footer">
          <a href="/login">Já tem conta? Faça login →</a>
        </div>
      </div>
    </div>
  );
};

export default PublicForm;
