import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ui/routes/ProtectedRoute";

// Importar componentes diretamente
import LoginScreen from "./ui/screens/Login";
import ForgotPasswordScreen from "./ui/screens/ForgotPassword"; 
import NewPasswordScreen from "./ui/screens/NewPassword";  
import ProjectsList from "./ui/screens/ProjectsList";
import CreateProject from "./ui/screens/CreateProject";
import SpecificProject from "./ui/screens/SpecificProject";
import UpdateProject from "./ui/screens/UpdateProject";

function App() {
  return (
    <AuthProvider>
      <div>
        <BrowserRouter>
          <Routes>
            {/* --- Rotas Públicas --- */}
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            <Route path="/new-password/:token" element={<NewPasswordScreen />} />
            
            {/* --- Rotas Protegidas --- */}
            <Route element={<ProtectedRoute />}>
              {/* Mapear rotas protegidas diretamente */}
              <Route path="/" element={<ProjectsList />} /> 
              <Route path="/projects" element={<ProjectsList />} />
              <Route path="/projects/:id" element={<SpecificProject />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/update-project/:id" element={<UpdateProject />} />
            </Route>
            
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;