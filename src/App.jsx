import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Páginas públicas
import Login from './pages/Login';
import PublicForm from './pages/PublicForm';

// Páginas protegidas
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Equipamentos from './pages/Equipamentos';
import Atendimentos from './pages/Atendimentos';
import Recebimentos from './pages/Recebimentos';
import Faturas from './pages/Faturas';
import Testes from './pages/Testes';
import Remessa from './pages/Remessa';
import Usuarios from './pages/Usuarios';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/formulario" element={<PublicForm />} />
          
          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <Clientes />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipamentos"
            element={
              <PrivateRoute>
                <Equipamentos />
              </PrivateRoute>
            }
          />
          <Route
            path="/atendimentos"
            element={
              <PrivateRoute>
                <Atendimentos />
              </PrivateRoute>
            }
          />
          <Route
            path="/recebimentos"
            element={
              <PrivateRoute>
                <Recebimentos />
              </PrivateRoute>
            }
          />
          <Route
            path="/faturas"
            element={
              <PrivateRoute>
                <Faturas />
              </PrivateRoute>
            }
          />
          <Route
            path="/testes"
            element={
              <PrivateRoute>
                <Testes />
              </PrivateRoute>
            }
          />
          <Route
            path="/remessa"
            element={
              <PrivateRoute>
                <Remessa />
              </PrivateRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <PrivateRoute>
                <Usuarios />
              </PrivateRoute>
            }
          />
          
          {/* Rota raiz redireciona para login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Rota 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
