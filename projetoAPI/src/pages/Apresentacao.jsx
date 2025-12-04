import React from "react";
import "./Apresentacao.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaHeart, FaBrain, FaClock, FaBook } from "react-icons/fa";

const PALETTE = { // Cores principais
  primary: "#e354a6", 
};

export default function CardsSection() {
  const cardsData = [ // Dados dos cards
    {
      icon: <FaHeart />, // Ícone de coração
      title: "Autoestima",
      text: "Fortalecendo a confiança dos alunos."
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

  return (
    <div>
<Header />
        {/* CARDS */}
        <div className="card-row">
          {cardsData.map((card, index) => ( // Mapeia os dados para criar os cards
        <div key={index} className="card-item">
          <div className="card-icon">{card.icon}</div> // Ícone do card
          <div className="card-tt">
          <h3 className="card-title">{card.title}</h3> // Título do card
          <p className="card-text">{card.text}</p> // Texto do card
          </div>
            </div>
          ))}
        </div>
<Footer />
      </div>
  );
}
