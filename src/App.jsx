// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/admin/pages/Login";
import Home from "./features/user/pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}