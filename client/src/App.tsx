import React from 'react'; // Adicionar import do React se ainda não tiver
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ui/routes/ProtectedRoute";
import pageConfigs from "./ui/routes/pages"; 
import { screenComponentMap, ScreenComponent } from "./ui/routes/route"; 

import LoginScreen from "./ui/screens/Login";
import ForgotPasswordScreen from "./ui/screens/ForgotPassword"; 
import NewPasswordScreen from "./ui/screens/NewPassword";  
import ProjectsList from "./ui/screens/ProjectsList"; 


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- Rotas Públicas --- */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
          <Route path="/new-password/:token" element={<NewPasswordScreen />} />
          
          {/* --- Rotas Protegidas (Geradas Dinamicamente) --- */}
          <Route element={<ProtectedRoute />}>
            {/* Rota raiz padrão se autenticado */}
            <Route path="/" element={<ProjectsList />} /> 
            
            {
              pageConfigs
                .filter(page => 
                  // Filtra rotas que são públicas ou não têm componente mapeado
                  page.link !== '/login' && 
                  page.link !== '/forgot-password' && 
                  !page.link.startsWith('/new-password/') &&
                  screenComponentMap[page.componentKey] // Garante que o componente exista no mapa
                )
                .map((page) => {
                  const ComponentToRender = screenComponentMap[page.componentKey] as ScreenComponent; 
                  return (
                    <Route 
                      key={page.link} 
                      path={page.link} 
                      element={<ComponentToRender />} 
                    />
                  );
                })
            }
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;