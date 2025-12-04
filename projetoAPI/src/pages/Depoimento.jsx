import React, { useState } from "react";
import "./Depoimento.css";
import Footer from "../components/Footer";

// Importa os vídeos que estão dentro da pasta assets
import depo1 from "../assets/Video1.mp4";
import depo2 from "../assets/Video2.mp4";
import depo3 from "../assets/Video3.mp4";
import depo4 from "../assets/Video4.mp4";
import depo5 from "../assets/Video5.mp4";

// Componente principal da página de depoimentos
export default function Testimonials() {
  
  // Estado que controla qual filtro está selecionado
  const [filter, setFilter] = useState("Todos");

  // Lista com os depoimentos — inclui nome, ano, texto, cor do avatar e vídeo
  const data = [
    { 
      name: "João Pedro",               // Nome do aluno
      grade: "1º ANO",                  // Série
      text: "A professora me ajudou muito com matemática. As aulas são divertidas!", // Depoimento escrito
      color: "#8bc8ff",                 // Cor do avatar
      video: depo1                      // Vídeo associado
    },
    { 
      name: "Ana Clara",
      grade: "1º ANO",
      text: "Adoro os projetos de artes. Aprendi a me expressar melhor.",
      color: "#ffb3c8",
      video: depo2
    },
    { 
      name: "Lucas M.",
      grade: "1º ANO",
      text: "Sinto saudades das aulas. O Guia me ajudou a organizar meus estudos.",
      color: "#c9f5dd",
      video: depo3
    },
    { 
      name: "Mariana",
      grade: "1º ANO",
      text: "A escola ficou mais legal com as atividades novas.",
      color: "#ffe59e",
      video: depo4
    },
    { 
      name: "Rafael",
      grade: "1º ANO",
      text: "Gosto quando usamos a tecnologia na sala.",
      color: "#d4c8ff",
      video: depo5
    },
  ];

  // Lista de categorias de filtro (mostra no menu)
  const grades = ["Todos", "1º Ano"];

  // Função para normalizar textos (remove acentos e deixa minúsculo)
  const normalize = (str) =>
    String(str)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // Aplica o filtro — se for “Todos”, retorna tudo
  const filtered =
    filter === "Todos"
      ? data
      : data.filter(item => normalize(item.grade).includes(normalize(filter)));

  // Retorno da interface da página
  return (
    <>
      <div className="testimonials-container"> {/* Container principal da página */}
        
        <h2 className="section-title">O que dizem nossos alunos</h2> {/* Título da seção */}

        {/* Botões do filtro */}
        <div className="filter-buttons">
          {grades.map(g => (
            <button
              key={g}                                            // Chave única para cada botão
              type="button"                                      // Tipo do botão
              className={`filter-btn ${filter === g ? "active" : ""}`} // Aplica classe “active” se selecionado
              onClick={() => setFilter(g)}                      // Atualiza o filtro ao clicar
            >
              {g}                                                {/* Texto do botão */}
            </button>
          ))}
        </div>

        {/* Grid que lista os depoimentos filtrados */}
        <div className="cards-grid">
          {filtered.map((student, index) => (
            <div key={`${student.name}-${index}`} className="testimonial-card">
              
              {/* Avatar colorido com a inicial do nome */}
              <div className="avatar" style={{ background: student.color }}>
                {student.name.charAt(0).toUpperCase()}
              </div>

              {/* Área de informações */}
              <div className="card-info">
                
                <h3 className="student-name">{student.name}</h3>           {/* Nome */}
                
                <span className="student-grade">{student.grade}</span>     {/* Ano */}
                
                <p className="student-text">"{student.text}"</p>           {/* Depoimento escrito */}

                {/* Vídeo opcional */}
                {student.video && (
                  <video className="testimonial-video" controls>
                    <source src={student.video} type="video/mp4" />
                    Seu navegador não suporta vídeos.
                  </video>
                )}

                {/* Estrelas de avaliação */}
                <div className="stars">★★★★★</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rodapé do site */}
      <Footer />
    </>
  );
}
