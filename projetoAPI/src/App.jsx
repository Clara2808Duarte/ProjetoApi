import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "../components/NavBar";
import Apresentacao from "./pages/Apresentacao";
import Professora from "./pages/SobreProfessora";
import Calendario from "./pages/Calendario";
import Depoimentos from "./pages/Depoimento";
import Colaboradoras from "./pages/SobreNos";

// IMPORTA O CHAT
import IA from "./pages/IA";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Apresentacao />} />
        <Route path="/professora" element={<Professora />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/depoimentos" element={<Depoimentos />} />
        <Route path="/asgatitas" element={<Colaboradoras />} />

        {/* NOVA ROTA DO CHAT */}
        <Route path="/ia" element={<IA />} />
      </Routes>
    </BrowserRouter>
  );
}
