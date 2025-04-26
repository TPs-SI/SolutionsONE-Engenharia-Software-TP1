import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ui/routes/ProtectedRoute";
import pageConfigs from "./ui/routes/pages"; 
import { screenComponentMap } from "./ui/routes/route"; 
import LoginScreen from "./ui/screens/Login";

function App() {
  return (
    <AuthProvider>
      <div>
        <BrowserRouter>
          <Routes>
            {/* Rota Pública: Login (pode ser definida manualmente ou via config) */}
            <Route path="/login" element={<LoginScreen />} />
            
            {/* Rotas Protegidas */}
            <Route element={<ProtectedRoute />}>
              {
                pageConfigs
                  .filter(page => page.link !== '/login') 
                  .map((page) => {
                    const ComponentToRender = screenComponentMap[page.componentKey]; 
                    if (!ComponentToRender) {
                         console.error(`Componente não encontrado para a chave: ${page.componentKey}`);
                         return null; 
                    }
                    return (
                      <Route 
                        key={page.link} 
                        path={page.link} 
                        element={<ComponentToRender />} 
                      />
                    );
                  })
              }
                {/* Rota raiz pode precisar ser definida manualmente se não estiver em pageConfigs */}
                 <Route path="/" element={<ProjectsList />} /> {/* Exemplo */}

            </Route>
            
            {/* Adicionar rotas públicas de recuperação de senha aqui */}
            {/* <Route path="/forgot-password" element={screenComponentMap['ForgotPasswordScreen']} /> */}
            {/* <Route path="/new-password/:token" element={screenComponentMap['NewPasswordScreen']} /> */}

          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;

import ProjectsList from "./ui/screens/ProjectsList"; 