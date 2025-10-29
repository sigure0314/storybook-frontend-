import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Controller from "./pages/Controller";
import Display from "./pages/Display";
// import Solo from "./pages/Solo"; // 若有單人模式則開啟

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/controller" element={<Controller />} />
        <Route path="/display" element={<Display />} />
        {/* <Route path="/solo" element={<Solo />} /> */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
