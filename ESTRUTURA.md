# Estrutura Completa do Projeto FAJ BIO

## 📁 Estrutura de Arquivos

```
faj-bio/
├── index.html                      # HTML principal
├── package.json                    # Dependências e scripts
├── vite.config.js                  # Configuração do Vite
├── .gitignore                      # Arquivos ignorados pelo Git
├── README.md                       # Documentação principal
│
└── src/
    ├── main.jsx                    # Entry point da aplicação
    ├── App.jsx                     # Componente raiz com rotas
    ├── index.css                   # Estilos globais
    │
    ├── components/                 # Componentes reutilizáveis
    │   ├── Layout.jsx              # Layout principal com sidebar
    │   ├── Layout.css
    │   ├── Sidebar.jsx             # Menu lateral de navegação
    │   ├── Sidebar.css
    │   ├── Modal.jsx               # Modal reutilizável para edição
    │   ├── Modal.css
    │   └── PrivateRoute.jsx        # Proteção de rotas autenticadas
    │
    ├── pages/                      # Páginas da aplicação
    │   ├── Login.jsx               # Página de login
    │   ├── Login.css
    │   ├── PublicForm.jsx          # Formulário público (sem auth)
    │   ├── PublicForm.css
    │   ├── Dashboard.jsx           # Dashboard principal
    │   ├── Dashboard.css
    │   ├── Clientes.jsx            # CRUD de clientes
    │   ├── Equipamentos.jsx        # CRUD de equipamentos
    │   ├── Recebimentos.jsx        # CRUD de recebimentos
    │   ├── Faturas.jsx             # CRUD de faturas
    │   ├── Testes.jsx              # CRUD de testes
    │   ├── Remessa.jsx             # CRUD de remessas
    │   ├── Usuarios.jsx            # CRUD de usuários
    │   └── CrudPage.css            # CSS compartilhado pelas páginas CRUD
    │
    ├── context/                    # Context API
    │   └── AuthContext.jsx         # Contexto de autenticação
    │
    └── services/                   # Serviços
        └── api.js                  # Configuração do Axios
```

## 🔑 Principais Arquivos e Suas Funções

### Configuração Base
- **package.json**: Define dependências (React, React Router, Axios) e scripts npm
- **vite.config.js**: Configuração do bundler Vite
- **index.html**: HTML base com div#root

### Entry Points
- **main.jsx**: Renderiza o componente App no DOM
- **App.jsx**: Define todas as rotas da aplicação

### Serviços
- **api.js**: 
  - Instância configurada do Axios
  - Interceptor para adicionar token JWT
  - Interceptor para tratar erros 401
  - Base URL: http://localhost:8080/api

### Contexto
- **AuthContext.jsx**:
  - Gerencia estado de autenticação
  - Funções: login(), logout(), isAuthenticated()
  - Armazena token no localStorage

### Componentes Base
- **Layout.jsx**: Wrapper com Sidebar para páginas autenticadas
- **Sidebar.jsx**: Menu de navegação lateral com 8 opções
- **Modal.jsx**: Modal genérico para formulários de edição
- **PrivateRoute.jsx**: HOC para proteger rotas

### Páginas Públicas
- **Login.jsx**: 
  - Formulário de login (username/password)
  - Envia POST /api/auth/login
  - Recebe token UUID
  - Link para formulário público

- **PublicForm.jsx**:
  - Formulário público sem autenticação
  - Envia POST /api/solicitacoes
  - Campos: empresa, cnpj, contato, setor, email, cep, endereco, produto, serial, ultimaCalibracao, descricao

### Páginas Protegidas
- **Dashboard.jsx**: 
  - Exibe estatísticas em cards
  - GET /api/dashboard/stats

- **Páginas CRUD** (Clientes, Equipamentos, Recebimentos, Faturas, Testes, Remessa, Usuarios):
  - Padrão uniforme para todas
  - Tabela com lista de itens
  - Botões Editar/Excluir por linha
  - Modal para criar/editar
  - Endpoints:
    - GET /api/{entidade}
    - GET /api/{entidade}/{id}
    - POST /api/{entidade}
    - PUT /api/{entidade}/{id}
    - DELETE /api/{entidade}/{id}

## 🎨 Tema de Cores

- **Primary Red**: #dc2626
- **Dark Red**: #991b1b
- **Light Red**: #fca5a5
- **Background Red**: #fee2e2

## 🚀 Como Usar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Ajustar URL do backend** em `src/services/api.js` se necessário

3. **Rodar em desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Acessar**: http://localhost:5173

## 📝 Fluxo de Autenticação

1. Usuário acessa `/login`
2. Envia username/password para `/api/auth/login`
3. Backend retorna token UUID
4. Token salvo no localStorage
5. Axios adiciona token em todas requisições subsequentes
6. Se token inválido (401), usuário redirecionado para login

## 🔧 Customização

Para adicionar nova entidade CRUD:
1. Copiar uma página CRUD existente (ex: Clientes.jsx)
2. Ajustar campos do formData
3. Ajustar colunas da tabela
4. Ajustar campos do formulário no Modal
5. Adicionar rota no App.jsx
6. Adicionar item no Sidebar.jsx
