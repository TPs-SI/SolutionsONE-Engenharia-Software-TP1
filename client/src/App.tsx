import { BrowserRouter, Routes, Route } from "react-router-dom";

import pages from "./ui/routes/pages";

function App() {
  return (
    <div>
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
  );
}

export default App
