# FAJ BIO - Assistência Técnica

Sistema de gestão de assistência técnica desenvolvido com React e Vite.

## 🚀 Tecnologias

- React 18
- Vite
- React Router DOM v6
- Axios
- CSS Modules

## 📋 Funcionalidades

### Páginas Públicas
- **Login**: Autenticação de usuários
- **Formulário Público**: Envio de solicitações de assistência técnica sem autenticação

### Páginas Protegidas (requer login)
- **Dashboard**: Visão geral do sistema
- **Clientes**: Gerenciamento de clientes
- **Equipamentos**: Controle de equipamentos
- **Recebimentos**: Registro de recebimentos
- **Faturas**: Gestão de faturas
- **Testes**: Controle de testes realizados
- **Remessa**: Gerenciamento de remessas
- **Usuários**: Administração de usuários do sistema

## 🎨 Design

O sistema utiliza tema vermelho (#dc2626) como cor principal, com interface moderna e responsiva.

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure a URL do backend no arquivo `src/services/api.js`:
```javascript
baseURL: 'http://localhost:8080/api'
```

## 🏃 Executar o Projeto

### Modo de Desenvolvimento
```bash
npm run dev
```

### Build para Produção
```bash
npm run build
```

### Visualizar Build de Produção
```bash
npm run preview
```

## 🌐 Rotas

### Públicas
- `/login` - Página de login
- `/formulario` - Formulário público de solicitação

### Protegidas (requer autenticação)
- `/dashboard` - Dashboard principal
- `/clientes` - Gestão de clientes
- `/equipamentos` - Gestão de equipamentos
- `/recebimentos` - Gestão de recebimentos
- `/faturas` - Gestão de faturas
- `/testes` - Gestão de testes
- `/remessa` - Gestão de remessas
- `/usuarios` - Gestão de usuários

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação:
- Token armazenado no localStorage
- Interceptor Axios adiciona token automaticamente nas requisições
- Redirecionamento automático para login em caso de token inválido/expirado

## 📡 Endpoints Esperados do Backend

### Autenticação
- `POST /api/auth/login` - Login (recebe username e password, retorna token)

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas do dashboard

### CRUD Endpoints (padrão para todas as entidades)
Para cada entidade (clientes, equipamentos, recebimentos, faturas, testes, remessas, usuarios):
- `GET /api/{entidade}` - Listar todos
- `GET /api/{entidade}/{id}` - Buscar por ID
- `POST /api/{entidade}` - Criar novo
- `PUT /api/{entidade}/{id}` - Atualizar
- `DELETE /api/{entidade}/{id}` - Excluir

### Formulário Público
- `POST /api/solicitacoes` - Enviar solicitação pública

## 📝 Estrutura de Pastas

```
src/
├── components/         # Componentes reutilizáveis
│   ├── Layout.jsx
│   ├── Sidebar.jsx
│   ├── Modal.jsx
│   └── PrivateRoute.jsx
├── pages/             # Páginas da aplicação
│   ├── Login.jsx
│   ├── PublicForm.jsx
│   ├── Dashboard.jsx
│   ├── Clientes.jsx
│   ├── Equipamentos.jsx
│   ├── Recebimentos.jsx
│   ├── Faturas.jsx
│   ├── Testes.jsx
│   ├── Remessa.jsx
│   └── Usuarios.jsx
├── context/           # Context API
│   └── AuthContext.jsx
├── services/          # Serviços e API
│   └── api.js
├── App.jsx            # Componente principal
├── main.jsx          # Entry point
└── index.css         # Estilos globais
```

## 🎯 Padrão de Desenvolvimento

Todas as páginas CRUD seguem o mesmo padrão:
1. Lista de itens em tabela
2. Botões de ação (Editar/Excluir) em cada linha
3. Modal para edição/criação
4. Integração com API usando Axios
5. Autenticação via token JWT

## 📄 Licença

Projeto desenvolvido para fins educacionais.
