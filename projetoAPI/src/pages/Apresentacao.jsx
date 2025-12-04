// Importa o React
import React from "react";

// Importa o CSS específico desta página
import "./Apresentacao.css";

// Importa os componentes de layout
// import Header from "../components/Header";
import Footer from "../components/Footer";

// Importa ícones da biblioteca react-icons
import { FaHeart, FaBrain, FaClock, FaBook } from "react-icons/fa";

// Paleta de cores (caso queira usar futuramente)
const PALETTE = {
  primary: "#e354a6",
};

// Componente principal da seção de cards
export default function CardsSection() {

  // Lista de cards exibidos dinamicamente
  const cardsData = [
    {
      icon: <FaHeart />,                       // Ícone
      title: "Autoestima",                     // Título do card
      text: "Fortalecendo a confiança dos alunos."  // Texto do card
    },
    {
      icon: <FaBrain />,
      title: "Saúde Emocional",
      text: "Gestão de sentimentos e ansiedade."
    },
    {
      icon: <FaClock />,
      title: "Produtividade",
      text: "Técnicas de estudo eficazes."
    },
  ];

  // Estrutura visual do componente
  return (
    <div> {/* Container geral da página */}

      {/* <Header /> Cabeçalho do site */}

      {/* Linha dos cards */}
      <div className="card-row">
        {/* Percorre a lista de cards e cria um card para cada item */}
        {cardsData.map((card, index) => (
          
          <div key={index} className="card-item"> {/* Card individual */}
            
            {/* Ícone dentro do card */}
            <div className="card-icon">{card.icon}</div>

            {/* Texto do card */}
            <div className="card-tt">
              <h3 className="card-title">{card.title}</h3>  {/* Título */}
              <p className="card-text">{card.text}</p>      {/* Texto */}
            </div>

          </div>
        ))}
      </div>

      <Footer /> {/* Rodapé */}

    </div>
  );
}
