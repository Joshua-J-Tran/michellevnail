import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import HomePage from "./pages/public/home";

import { Toaster } from "react-hot-toast";


function App() {
  return (
    <div>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Placeholder route to replace later */}
          <Route path="/ipad" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
