import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ui/routes/ProtectedRoute";
import LoginScreen from "./ui/screens/Login"; 

// Importar os componentes das páginas protegidas
import ProjectsList from "./ui/screens/ProjectsList";
import CreateProject from "./ui/screens/CreateProject";
import SpecificProject from "./ui/screens/SpecificProject";
import UpdateProject from "./ui/screens/UpdateProject";
// Importar outros componentes protegidos (UserList, ContractsList, Profile/MinhaConta, etc.)

function App() {
  return (
    <AuthProvider>
      <div>
        <BrowserRouter>
          <Routes>
            {/* Rota Pública: Login */}
            <Route path="/login" element={<LoginScreen />} />
            {/* Adicionar aqui outras rotas públicas como /forgot-password, /new-password/:token */}
            
            {/* Rotas Protegidas */}
            <Route element={<ProtectedRoute />}> 
              <Route path="/" element={<ProjectsList />} /> 
              <Route path="/projects" element={<ProjectsList />} />
              <Route path="/projects/:id" element={<SpecificProject />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/update-project/:id" element={<UpdateProject />} />
              {/* Adicione outras rotas protegidas aqui (Users, Contracts, Profile, etc.) */}
              {/* <Route path="/users" element={<UserListScreen />} /> */}
              {/* <Route path="/contracts" element={<ContractListScreen />} /> */}
              {/* <Route path="/account" element={<ProfileScreen />} /> */}
            </Route>

          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;