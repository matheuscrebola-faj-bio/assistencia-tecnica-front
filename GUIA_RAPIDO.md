# Guia Rápido - FAJ BIO

## 🚀 Início Rápido

### 1. Instalar Dependências
```bash
cd faj-bio
npm install
```

### 2. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

O sistema estará disponível em: **http://localhost:5173**

## 🔧 Configuração do Backend

O frontend espera que o backend esteja rodando em: **http://localhost:8080**

Se sua API estiver em outra URL, edite o arquivo `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://SEU_BACKEND:PORTA/api',
  // ...
});
```

## 📡 Endpoints Esperados

### Autenticação
```
POST /api/auth/login
Body: { "username": "string", "password": "string" }
Response: { "token": "uuid-string" }
```

### Formulário Público (SEM autenticação)
```
POST /api/solicitacoes
Body: {
  "empresa": "string",
  "cnpj": "string",
  "contato": "string",
  "setor": "string",
  "email": "string",
  "cep": "string",
  "endereco": "string",
  "produto": "string",
  "serial": "string",
  "ultimaCalibracao": "date",
  "descricao": "string"
}
```

### Dashboard (COM autenticação)
```
GET /api/dashboard/stats
Header: Authorization: Bearer {token}
Response: {
  "clientes": number,
  "equipamentos": number,
  "recebimentos": number,
  "faturas": number
}
```

### CRUD Genérico (COM autenticação)
Para: clientes, equipamentos, recebimentos, faturas, testes, remessas, usuarios

```
GET    /api/{entidade}           # Listar todos
GET    /api/{entidade}/{id}      # Buscar por ID
POST   /api/{entidade}           # Criar
PUT    /api/{entidade}/{id}      # Atualizar
DELETE /api/{entidade}/{id}      # Excluir
```

**Todas as requisições autenticadas devem incluir:**
```
Header: Authorization: Bearer {token}
```

## 📋 Estrutura de Dados Esperada

### Clientes
```json
{
  "id": number,
  "nome": "string",
  "cnpj": "string",
  "email": "string",
  "telefone": "string",
  "endereco": "string"
}
```

### Equipamentos
```json
{
  "id": number,
  "produto": "string",
  "serial": "string",
  "descricao": "string",
  "ultimaCalibracao": "date",
  "clienteId": number
}
```

### Recebimentos
```json
{
  "id": number,
  "equipamentoId": number,
  "dataRecebimento": "date",
  "status": "string",
  "observacoes": "string"
}
```

### Faturas
```json
{
  "id": number,
  "clienteId": number,
  "valor": number,
  "dataEmissao": "date",
  "dataVencimento": "date",
  "status": "string"
}
```

### Testes
```json
{
  "id": number,
  "equipamentoId": number,
  "tipoTeste": "string",
  "dataTeste": "date",
  "resultado": "string",
  "observacoes": "string"
}
```

### Remessas
```json
{
  "id": number,
  "equipamentoId": number,
  "dataRemessa": "date",
  "transportadora": "string",
  "codigoRastreio": "string",
  "destino": "string"
}
```

### Usuarios
```json
{
  "id": number,
  "username": "string",
  "password": "string",
  "nome": "string",
  "email": "string",
  "role": "string"
}
```

## 🎯 Fluxo de Uso

1. **Acesse** http://localhost:5173
2. **Login** com usuário/senha (ou crie no backend)
3. **Navegue** usando o menu lateral vermelho
4. **Gerencie** dados em cada módulo
5. **Formulário Público** disponível em /formulario (sem login)

## 🔐 Segurança

- Token JWT armazenado no localStorage
- Token enviado automaticamente em todas requisições
- Redirecionamento automático para login se token expirar
- Rotas protegidas por PrivateRoute

## 🛠️ Scripts Disponíveis

```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Gera build de produção
npm run preview    # Visualiza build de produção
```

## 🐛 Troubleshooting

### Erro de CORS
Configure CORS no backend para aceitar requisições de `http://localhost:5173`

### Erro 401 (Unauthorized)
- Verifique se o token está sendo enviado corretamente
- Verifique se o backend está validando o token
- Limpe o localStorage: `localStorage.clear()`

### Erro de Conexão
- Verifique se o backend está rodando
- Confirme a URL correta em `src/services/api.js`

### Página em Branco
- Abra o Console do navegador (F12)
- Verifique erros de JavaScript
- Confirme se todas as dependências foram instaladas

## 📞 Suporte

Para problemas com:
- **Frontend**: Verifique console do navegador
- **Backend**: Verifique logs do servidor
- **Comunicação**: Verifique Network tab no DevTools
