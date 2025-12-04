import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import './CrudPage.css';
import './Testes.css';

const Testes = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isMCA1811ModalOpen, setIsMCA1811ModalOpen] = useState(false);
  const [isMCA1878ModalOpen, setIsMCA1878ModalOpen] = useState(false);
  
  // Listas para os selects
  const [termometros, setTermometros] = useState([]);
  const [cronometros, setCronometros] = useState([]);

  // Formulário MCA Plus 1878
  const [formMCA1878, setFormMCA1878] = useState({
    // Módulo 1: Testes Elétricos
    cpuPt9_5v: '',
    cpuPt9_3v: '',
    fontePt6: '',
    versaoSoftware: '1.0',
    
    // Módulo 2: Ajustes
    valorInicial: '',
    valorPosAjuste: '',
    ajustarSensorInclinacao: false,
    ajustarContrasteDisplay: false,
    
    // Módulo 3: Inspeções e Testes
    inspecao1_ledRede: false,
    inspecao2_bateria: false,
    inspecao3_versaoAquecer: false,
    inspecao4_ledAquecimento: false,
    inspecao5_ledDeteccaoTubo: false,
    inspecao6_erroSemTubo: false,
    inspecao7_erroTCA: false,
    inspecao8_fimTeste: false,
    inspecao9_inclinacao: false,
    inspecao10_999segundos: false,
    
    // Módulo 4: Testes de Simulação de Tempo
    teste_t1: '',
    teste_t2: '',
    teste_t100: '',
    teste_t300: '',
    dataInicioRunIn: '',
    horaInicioRunIn: '',
    dataFimRunIn: '',
    horaFimRunIn: '',
    aprovadoRunIn: false,
    
    // Resultado final
    resultadoFinal: ''
  });

  // Formulário MCA Plus 1811
  const [formMCA1811, setFormMCA1811] = useState({
    // Teste 1 - Tubo com seta para cima
    teste1_t1: '',
    teste1_t2: '',
    teste1_t100: '',
    teste1_t300: '',
    teste1_aprovado: false,
    
    // Teste 2 - Tubo com seta deslocada
    teste2_t1: '',
    teste2_t2: '',
    teste2_t100: '',
    teste2_t300: '',
    teste2_reprovado: false,
    
    // Temperatura interna
    temperaturaInterna: '',
    
    // Condições Ambientais
    temperaturaAmbiente: '',
    umidadeRelativa: '',
    observacoes: '',
    
    // Equipamentos para Calibração
    termometroDigital: '',
    cronometro: '',
    
    // Resultado final
    resultadoFinal: ''
  });

  useEffect(() => {
    loadItems();
    loadEquipamentos();
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

  const loadEquipamentos = async () => {
    try {
      const [termRes, cronRes] = await Promise.all([
        api.get('/equipamentos/termometros'),
        api.get('/equipamentos/cronometros')
      ]);
      setTermometros(termRes.data);
      setCronometros(cronRes.data);
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
    }
  };

  const handleSelectEquipamento = (tipo) => {
    setIsSelectModalOpen(false);
    if (tipo === 'MCA1811') {
      resetFormMCA1811();
      setIsMCA1811ModalOpen(true);
    } else if (tipo === 'MCA1878') {
      resetFormMCA1878();
      setIsMCA1878ModalOpen(true);
    }
  };

  const resetFormMCA1878 = () => {
    setFormMCA1878({
      cpuPt9_5v: '',
      cpuPt9_3v: '',
      fontePt6: '',
      versaoSoftware: '1.0',
      valorInicial: '',
      valorPosAjuste: '',
      ajustarSensorInclinacao: false,
      ajustarContrasteDisplay: false,
      inspecao1_ledRede: false,
      inspecao2_bateria: false,
      inspecao3_versaoAquecer: false,
      inspecao4_ledAquecimento: false,
      inspecao5_ledDeteccaoTubo: false,
      inspecao6_erroSemTubo: false,
      inspecao7_erroTCA: false,
      inspecao8_fimTeste: false,
      inspecao9_inclinacao: false,
      inspecao10_999segundos: false,
      teste_t1: '',
      teste_t2: '',
      teste_t100: '',
      teste_t300: '',
      dataInicioRunIn: '',
      horaInicioRunIn: '',
      dataFimRunIn: '',
      horaFimRunIn: '',
      aprovadoRunIn: false,
      resultadoFinal: ''
    });
  };

  const handleChangeMCA1878 = (e) => {
    const { name, value, type, checked } = e.target;
    setFormMCA1878({
      ...formMCA1878,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveMCA1878 = async (e) => {
    e.preventDefault();
    try {
      await api.post('/testes/mca1878', {
        tipoEquipamento: 'MCA_PLUS_1878',
        ...formMCA1878
      });
      setIsMCA1878ModalOpen(false);
      loadItems();
    } catch (error) {
      console.error('Erro ao salvar teste:', error);
    }
  };

  const resetFormMCA1811 = () => {
    setFormMCA1811({
      teste1_t1: '',
      teste1_t2: '',
      teste1_t100: '',
      teste1_t300: '',
      teste1_aprovado: false,
      teste2_t1: '',
      teste2_t2: '',
      teste2_t100: '',
      teste2_t300: '',
      teste2_reprovado: false,
      temperaturaInterna: '',
      temperaturaAmbiente: '',
      umidadeRelativa: '',
      observacoes: '',
      termometroDigital: '',
      cronometro: '',
      resultadoFinal: ''
    });
  };

  const handleChangeMCA1811 = (e) => {
    const { name, value, type, checked } = e.target;
    setFormMCA1811({
      ...formMCA1811,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveMCA1811 = async (e) => {
    e.preventDefault();
    try {
      await api.post('/testes/mca1811', {
        tipoEquipamento: 'MCA_PLUS_1811',
        ...formMCA1811
      });
      setIsMCA1811ModalOpen(false);
      loadItems();
    } catch (error) {
      console.error('Erro ao salvar teste:', error);
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

  return (
    <Layout>
      <div className="crud-page">
        <div className="page-header">
          <h1>Testes</h1>
          <button className="btn-primary" onClick={() => setIsSelectModalOpen(true)}>
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
                  <th>Tipo Equipamento</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Cliente</th>
                  <th>Resultado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      Nenhum teste cadastrado
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.tipoEquipamento}</td>
                      <td>{item.dataTeste}</td>
                      <td>
                        <span className={`badge badge-${item.resultadoFinal?.toLowerCase()}`}>
                          {item.resultadoFinal}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
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

        {/* Modal de Seleção de Equipamento */}
        <Modal
          isOpen={isSelectModalOpen}
          onClose={() => setIsSelectModalOpen(false)}
          title="Selecione o Tipo de Equipamento"
        >
          <div className="select-equipamento">
            <button
              className="btn-equipamento"
              onClick={() => handleSelectEquipamento('MCA1811')}
            >
              <span className="equipamento-icon">🔬</span>
              <span className="equipamento-nome">MCA Plus 1811</span>
            </button>
            <button
              className="btn-equipamento"
              onClick={() => handleSelectEquipamento('MCA1878')}
            >
              <span className="equipamento-icon">🔬</span>
              <span className="equipamento-nome">MCA Plus 1878</span>
            </button>
          </div>
        </Modal>

        {/* Modal MCA Plus 1811 */}
        <Modal
          isOpen={isMCA1811ModalOpen}
          onClose={() => setIsMCA1811ModalOpen(false)}
          title="Teste de Calibração - MCA Plus 1811"
        >
          <form onSubmit={handleSaveMCA1811} className="form-mca">
            {/* MÓDULO 1: Testes de Calibração */}
            <div className="modulo">
              <h3 className="modulo-titulo">1. Testes de Calibração</h3>
              
              {/* Teste 1 */}
              <div className="teste-group">
                <div className="teste-instrucao">
                  <strong>Teste 1:</strong> Ligar o MCA pressionando a tecla "ferramentas". 
                  Em seguida, inserir o tubo teste com a seta para cima e teclar em "iniciar", 
                  para o início da simulação.
                </div>
                
                <div className="campos-grid">
                  <div className="form-group">
                    <label>T1 (segundos)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="teste1_t1"
                      value={formMCA1811.teste1_t1}
                      onChange={handleChangeMCA1811}
                      placeholder="5 < T1 < 12"
                      required
                    />
                    <span className="campo-hint">5 &lt; T1 &lt; 12</span>
                  </div>
                  
                  <div className="form-group">
                    <label>T2 (segundos)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="teste1_t2"
                      value={formMCA1811.teste1_t2}
                      onChange={handleChangeMCA1811}
                      placeholder="4 < T2 < 12"
                      required
                    />
                    <span className="campo-hint">4 &lt; T2 &lt; 12</span>
                  </div>
                  
                  <div className="form-group">
                    <label>T100 (segundos)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="teste1_t100"
                      value={formMCA1811.teste1_t100}
                      onChange={handleChangeMCA1811}
                      placeholder="98 < T100 < 102"
                      required
                    />
                    <span className="campo-hint">98 &lt; T100 &lt; 102</span>
                  </div>
                  
                  <div className="form-group">
                    <label>T300 (segundos)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="teste1_t300"
                      value={formMCA1811.teste1_t300}
                      onChange={handleChangeMCA1811}
                      placeholder="298 < T300 < 302"
                      required
                    />
                    <span className="campo-hint">298 &lt; T300 &lt; 302</span>
                  </div>
                </div>
                
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="teste1_aprovado"
                      checked={formMCA1811.teste1_aprovado}
                      onChange={handleChangeMCA1811}
                    />
                    <span className="checkmark"></span>
                    Teste Aprovado
                  </label>
                </div>
              </div>

              {/* Teste 2 */}
              <div className="teste-group">
                <div className="teste-instrucao">
                  <strong>Teste 2:</strong> Ligar o MCA pressionando a tecla "ferramentas". 
                  Em seguida, inserir o tubo teste com a seta para cima, porém deslocada, 
                  e teclar em "iniciar", para o início da simulação.
                </div>
                
                <div className="campos-grid">
                  <div className="form-group">
                    <label>T1 (segundos)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="teste2_t1"
                      value={formMCA1811.teste2_t1}
                      onChange={handleChangeMCA1811}
                      placeholder="5 < T1 < 12"
                      required
                    />
                    <span className="campo-hint">5 &lt; T1 &lt; 12</span>
                  </div>
                  
                  <div className="form-group">
                    <label>T2 (segundos)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="teste2_t2"
                      value={formMCA1811.teste2_t2}
                      onChange={handleChangeMCA1811}
                      placeholder="4 < T2 < 12"
                      required
                    />
                    <span className="campo-hint">4 &lt; T2 &lt; 12</span>
                  </div>
                  
                  <div className="form-group">
                    <label>T100 (segundos)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="teste2_t100"
                      value={formMCA1811.teste2_t100}
                      onChange={handleChangeMCA1811}
                      placeholder="98 < T100 < 102"
                      required
                    />
                    <span className="campo-hint">98 &lt; T100 &lt; 102</span>
                  </div>
                  
                  <div className="form-group">
                    <label>T300 (segundos)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="teste2_t300"
                      value={formMCA1811.teste2_t300}
                      onChange={handleChangeMCA1811}
                      placeholder="298 < T300 < 302"
                      required
                    />
                    <span className="campo-hint">298 &lt; T300 &lt; 302</span>
                  </div>
                </div>
                
                <div className="checkbox-group">
                  <label className="checkbox-label checkbox-reprovado">
                    <input
                      type="checkbox"
                      name="teste2_reprovado"
                      checked={formMCA1811.teste2_reprovado}
                      onChange={handleChangeMCA1811}
                    />
                    <span className="checkmark"></span>
                    Teste Reprovado
                  </label>
                </div>
              </div>

              {/* Temperatura Interna */}
              <div className="teste-group">
                <div className="form-group">
                  <label>Temperatura Interna do Tubo (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="temperaturaInterna"
                    value={formMCA1811.temperaturaInterna}
                    onChange={handleChangeMCA1811}
                    placeholder="36.5 <= T <= 37.5"
                    required
                  />
                  <span className="campo-hint">36.5 ≤ T ≤ 37.5 °C</span>
                </div>
              </div>
            </div>

            {/* MÓDULO 2: Condições Ambientais */}
            <div className="modulo">
              <h3 className="modulo-titulo">2. Condições Ambientais</h3>
              
              <div className="campos-grid-3">
                <div className="form-group">
                  <label>Temperatura Ambiente (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="temperaturaAmbiente"
                    value={formMCA1811.temperaturaAmbiente}
                    onChange={handleChangeMCA1811}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Umidade Relativa do Ar (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="umidadeRelativa"
                    value={formMCA1811.umidadeRelativa}
                    onChange={handleChangeMCA1811}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Observações e Não Conformidades</label>
                <textarea
                  name="observacoes"
                  value={formMCA1811.observacoes}
                  onChange={handleChangeMCA1811}
                  rows="3"
                  placeholder="Descreva observações ou não conformidades encontradas..."
                />
              </div>
            </div>

            {/* MÓDULO 3: Equipamentos para Calibração */}
            <div className="modulo">
              <h3 className="modulo-titulo">3. Equipamentos para Calibração</h3>
              
              <div className="campos-grid">
                <div className="form-group">
                  <label>Termômetro Digital</label>
                  <select
                    name="termometroDigital"
                    value={formMCA1811.termometroDigital}
                    onChange={handleChangeMCA1811}
                    required
                  >
                    <option value="">Selecione um termômetro</option>
                    {termometros.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nome} - {t.serial}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Cronômetro</label>
                  <select
                    name="cronometro"
                    value={formMCA1811.cronometro}
                    onChange={handleChangeMCA1811}
                    required
                  >
                    <option value="">Selecione um cronômetro</option>
                    {cronometros.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome} - {c.serial}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Resultado Final */}
            <div className="modulo resultado-final">
              <h3 className="modulo-titulo">Resultado Final</h3>
              
              <div className="form-group">
                <label>Parecer Técnico</label>
                <select
                  name="resultadoFinal"
                  value={formMCA1811.resultadoFinal}
                  onChange={handleChangeMCA1811}
                  required
                  className="select-resultado"
                >
                  <option value="">Selecione o resultado</option>
                  <option value="APROVADO">Aprovado</option>
                  <option value="INAPTO">Inapto para Uso</option>
                  <option value="ORCAMENTO">Gerar Orçamento</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsMCA1811ModalOpen(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Salvar Teste
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal MCA Plus 1878 */}
        <Modal
          isOpen={isMCA1878ModalOpen}
          onClose={() => setIsMCA1878ModalOpen(false)}
          title="Teste de Calibração - MCA Plus 1878"
        >
          <form onSubmit={handleSaveMCA1878} className="form-mca">
            {/* MÓDULO 1: Testes Elétricos */}
            <div className="modulo">
              <h3 className="modulo-titulo">1. Testes Elétricos</h3>
              
              <div className="campos-grid">
                <div className="form-group">
                  <label>CPU PT9 - 5V</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cpuPt9_5v"
                    value={formMCA1878.cpuPt9_5v}
                    onChange={handleChangeMCA1878}
                    placeholder="4.7V a 5.3V"
                    required
                  />
                  <span className="campo-hint">4.7V ≤ PT9 (CPU) ≤ 5.3V</span>
                </div>
                
                <div className="form-group">
                  <label>CPU PT9 - 3V</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cpuPt9_3v"
                    value={formMCA1878.cpuPt9_3v}
                    onChange={handleChangeMCA1878}
                    placeholder="3.2V a 3.4V"
                    required
                  />
                  <span className="campo-hint">3.2V ≤ PT9 (CPU) ≤ 3.4V</span>
                </div>
                
                <div className="form-group">
                  <label>Fonte PT6 (CPU)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="fontePt6"
                    value={formMCA1878.fontePt6}
                    onChange={handleChangeMCA1878}
                    placeholder="15.5V"
                    required
                  />
                  <span className="campo-hint">Ajustar para 15.5V PT6 (CPU)</span>
                </div>
                
                <div className="form-group">
                  <label>Versão do Software</label>
                  <input
                    type="text"
                    name="versaoSoftware"
                    value={formMCA1878.versaoSoftware}
                    onChange={handleChangeMCA1878}
                    required
                  />
                </div>
              </div>
            </div>

            {/* MÓDULO 2: Ajustes */}
            <div className="modulo">
              <h3 className="modulo-titulo">2. Ajustes</h3>
              
              <div className="campos-grid">
                <div className="form-group">
                  <label>Valor Inicial (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="valorInicial"
                    value={formMCA1878.valorInicial}
                    onChange={handleChangeMCA1878}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Valor Pós Ajuste (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="valorPosAjuste"
                    value={formMCA1878.valorPosAjuste}
                    onChange={handleChangeMCA1878}
                    required
                  />
                </div>
              </div>
              
              <div className="checkbox-list">
                <label className="checkbox-label checkbox-ajuste">
                  <input
                    type="checkbox"
                    name="ajustarSensorInclinacao"
                    checked={formMCA1878.ajustarSensorInclinacao}
                    onChange={handleChangeMCA1878}
                  />
                  <span className="checkmark"></span>
                  Ajustar o sensor de inclinação (ligar o MCA + tecla zerar acionada)
                </label>
                
                <label className="checkbox-label checkbox-ajuste">
                  <input
                    type="checkbox"
                    name="ajustarContrasteDisplay"
                    checked={formMCA1878.ajustarContrasteDisplay}
                    onChange={handleChangeMCA1878}
                  />
                  <span className="checkmark"></span>
                  Ajustar o contraste do display
                </label>
              </div>
            </div>

            {/* MÓDULO 3: Inspeções e Testes */}
            <div className="modulo">
              <h3 className="modulo-titulo">3. Inspeções e Testes (utilizando Tubo Kit)</h3>
              
              <div className="checkbox-list inspecao-list">
                <label className="checkbox-label checkbox-inspecao">
                  <input
                    type="checkbox"
                    name="inspecao1_ledRede"
                    checked={formMCA1878.inspecao1_ledRede}
                    onChange={handleChangeMCA1878}
                  />
                  <span className="checkmark"></span>
                  <span className="inspecao-texto">Conectar o MCA na rede e observar "Led da Rede" aceso</span>
                </label>
                
                <label className="checkbox-label checkbox-inspecao">
                  <input
                    type="checkbox"
                    name="inspecao2_bateria"
                    checked={formMCA1878.inspecao2_bateria}
                    onChange={handleChangeMCA1878}
                  />
                  <span className="checkmark"></span>
                  <span className="inspecao-texto">Ligar o MCA e desconectar da rede, observar a simbologia da bateria no display e "Led da Rede" apagado</span>
                </label>
                
                <label className="checkbox-label checkbox-inspecao">
                  <input
                    type="checkbox"
                    name="inspecao3_versaoAquecer"
                    checked={formMCA1878.inspecao3_versaoAquecer}
                    onChange={handleChangeMCA1878}
                  />
                  <span className="checkmark"></span>
                  <span className="inspecao-texto">Conectar a rede, desligar e ligar o MCA e observar no display a "versão" e a mensagem "aguarde aquecer"</span>
                </label>
                
                <label className="checkbox-label checkbox-inspecao">
                  <input
                    type="checkbox"
                    name="inspecao4_ledAquecimento"
                    checked={formMCA1878.inspecao4_ledAquecimento}
                    onChange={handleChangeMCA1878}
                  />
                  <span className="checkmark"></span>
                  <span className="inspecao-texto">Observar o LED de "aquecimento" verde piscando e após aquecimento a mensagem desaparece e o LED verde fica aceso direto</span>
                </label>
                
                <label className="checkbox-label checkbox-inspecao">
                  <input
                    type="checkbox"
                    name="inspecao5_ledDeteccaoTubo"
                    checked={formMCA1878.inspecao5_ledDeteccaoTubo}
                    onChange={handleChangeMCA1878}
                  />
                  <span className="checkmark"></span>
                  <span className="inspecao-texto">Observar o LED "detecção de tubo" vermelho sem tubo e verde com tubo</span>
                </label>
                
                <label className="checkbox-label checkbox-inspecao">
                  <input
                    type="checkbox"
                    name="inspecao6_erroSemTubo"
                    checked={formMCA1878.inspecao6_erroSemTubo}
                    onChange={handleChangeMCA1878}
                  />
                  <span className="checkmark"></span>
                  <span className="inspecao-texto">Sem o tubo, teclar "iniciar" e após 30 segundos deve aparecer a mensagem "erro sem tubo"</span>
                </label>
                
                <label className="checkbox-label checkbox-inspecao">
                  <input
                    type="checkbox"
                    name="inspecao7_erroTCA"
                    checked={formMCA1878.inspecao7_erroTCA}
                    onChange={handleChangeMCA1878}
                  />
                  <span className="checkmark"></span>
                  <span className="inspecao-texto">Com o tubo inserido, teclar "iniciar", observar a rotação rápida do motor e retirar o tubo em 40 segundos, deverá aparecer a mensagem "erro TCA &lt; 65s, refazer o teste"</span>
                </label>
                
                <label className="checkbox-label checkbox-inspecao">
                  <input
                    type="checkbox"
                    name="inspecao8_fimTeste"
                    checked={formMCA1878.inspecao8_fimTeste}
                    onChange={handleChangeMCA1878}
                  />
                  <span className="checkmark"></span>
                  <span className="inspecao-texto">Com o tubo inserido, teclar "iniciar" e em 100 segundos retirar o tubo. Deverá aparecer a mensagem "Fim do Teste"</span>
                </label>
                
                <label className="checkbox-label checkbox-inspecao">
                  <input
                    type="checkbox"
                    name="inspecao9_inclinacao"
                    checked={formMCA1878.inspecao9_inclinacao}
                    onChange={handleChangeMCA1878}
                  />
                  <span className="checkmark"></span>
                  <span className="inspecao-texto">Com o tubo inserido, teclar "iniciar" e simular uma inclinação frontal e uma lateral. Deverá aparecer as mensagens de "ajustar inclinação frontal" e "ajustar inclinação lateral". Após 15 segundos de erro de inclinação, aparecerá "erro de inclinação"</span>
                </label>
                
                <label className="checkbox-label checkbox-inspecao">
                  <input
                    type="checkbox"
                    name="inspecao10_999segundos"
                    checked={formMCA1878.inspecao10_999segundos}
                    onChange={handleChangeMCA1878}
                  />
                  <span className="checkmark"></span>
                  <span className="inspecao-texto">Com o tubo inserido, teclar "iniciar" e deixar rodar até 999 segundos (16 minutos e 39 segundos)</span>
                </label>
              </div>
            </div>

            {/* MÓDULO 4: Testes de Simulação de Tempo */}
            <div className="modulo">
              <h3 className="modulo-titulo">4. Testes de Simulação de Tempo</h3>
              
              <div className="campos-grid">
                <div className="form-group">
                  <label>T1 (segundos)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="teste_t1"
                    value={formMCA1878.teste_t1}
                    onChange={handleChangeMCA1878}
                    placeholder="5 < T1 < 12"
                    required
                  />
                  <span className="campo-hint">5 &lt; T1 &lt; 12</span>
                </div>
                
                <div className="form-group">
                  <label>T2 (segundos)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="teste_t2"
                    value={formMCA1878.teste_t2}
                    onChange={handleChangeMCA1878}
                    placeholder="4 < T2 < 12"
                    required
                  />
                  <span className="campo-hint">4 &lt; T2 &lt; 12</span>
                </div>
                
                <div className="form-group">
                  <label>T100 (segundos)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="teste_t100"
                    value={formMCA1878.teste_t100}
                    onChange={handleChangeMCA1878}
                    placeholder="98 < T100 < 102"
                    required
                  />
                  <span className="campo-hint">98 &lt; T100 &lt; 102</span>
                </div>
                
                <div className="form-group">
                  <label>T300 (segundos)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="teste_t300"
                    value={formMCA1878.teste_t300}
                    onChange={handleChangeMCA1878}
                    placeholder="298 < T300 < 302"
                    required
                  />
                  <span className="campo-hint">298 &lt; T300 &lt; 302</span>
                </div>
              </div>
              
              <div className="runin-section">
                <h4 className="runin-titulo">Run-In</h4>
                
                <div className="campos-grid">
                  <div className="form-group">
                    <label>Data Início</label>
                    <input
                      type="date"
                      name="dataInicioRunIn"
                      value={formMCA1878.dataInicioRunIn}
                      onChange={handleChangeMCA1878}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Hora Início</label>
                    <input
                      type="time"
                      name="horaInicioRunIn"
                      value={formMCA1878.horaInicioRunIn}
                      onChange={handleChangeMCA1878}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Data Fim</label>
                    <input
                      type="date"
                      name="dataFimRunIn"
                      value={formMCA1878.dataFimRunIn}
                      onChange={handleChangeMCA1878}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Hora Fim</label>
                    <input
                      type="time"
                      name="horaFimRunIn"
                      value={formMCA1878.horaFimRunIn}
                      onChange={handleChangeMCA1878}
                      required
                    />
                  </div>
                </div>
                
                <div className="checkbox-group">
                  <label className="checkbox-label checkbox-runin">
                    <input
                      type="checkbox"
                      name="aprovadoRunIn"
                      checked={formMCA1878.aprovadoRunIn}
                      onChange={handleChangeMCA1878}
                    />
                    <span className="checkmark"></span>
                    Aprovado no Run-In
                  </label>
                </div>
              </div>
            </div>

            {/* Resultado Final */}
            <div className="modulo resultado-final">
              <h3 className="modulo-titulo">Resultado Final</h3>
              
              <div className="form-group">
                <label>Parecer Técnico</label>
                <select
                  name="resultadoFinal"
                  value={formMCA1878.resultadoFinal}
                  onChange={handleChangeMCA1878}
                  required
                  className="select-resultado"
                >
                  <option value="">Selecione o resultado</option>
                  <option value="APROVADO">Aprovado</option>
                  <option value="INAPTO">Inapto para Uso</option>
                  <option value="ORCAMENTO">Gerar Orçamento</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsMCA1878ModalOpen(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Salvar Teste
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Testes;
