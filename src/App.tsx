import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/public/home";

import { Toaster } from "react-hot-toast";
import IpadPage from "./pages/public/ipad";

function App() {
  return (
    <div>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Placeholder route to replace later */}
          <Route path="/ipad" element={<IpadPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
