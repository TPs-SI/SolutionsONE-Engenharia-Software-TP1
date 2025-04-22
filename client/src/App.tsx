import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 

import pages from "./ui/routes/pages";

function App() {
  return (
    <AuthProvider> 
      <div> {/* Manter a div externa se necessário */}
        <BrowserRouter>
          <Routes>
              {
                pages.map((page) => (
                  <Route key={page.link} path={page.link} element={<page.component />} />
                ))
              }
            </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App