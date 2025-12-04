// import React, { useState } from "react";
// import "./Depoimento.css";
// import Footer from "../components/Footer";

// // IMPORTANDO OS VÍDEOS DOS ASSETS
// import depo1 from "../assets/Video1.mp4";
// import depo2 from "../assets/Video2.mp4";
// import depo3 from "../assets/Video3.mp4";
// import depo4 from "../assets/Video4.mp4";
// import depo5 from "../assets/Video5.mp4";

// export default function Testimonials() {
//   const [filter, setFilter] = useState("Todos");

//   // Agora cada item tem um VIDEO
//   const data = [
//     { name: "João Pedro", grade: "5º ANO", video: depo1 },
//     { name: "Ana Clara", grade: "3º ANO", video: depo2 },
//     { name: "Lucas M.", grade: "EX-ALUNO", video: depo3 },
//     { name: "Mariana", grade: "4º ANO", video: depo4 },
//     { name: "Rafael", grade: "2º ANO", video: depo5 },
//   ];

//   const grades = ["Todos", "2º Ano", "3º Ano", "4º Ano", "5º Ano", "Ex-Aluno"];

//   const normalize = (str) =>
//     String(str)
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, "")
//       .toLowerCase();

//   const filtered =
//     filter === "Todos"
//       ? data
//       : data.filter((item) => normalize(item.grade).includes(normalize(filter)));

//   return (
//     <div className="testimonials-container">
//       <h2 className="section-title">O que dizem nossos alunos</h2>

//       <div className="filter-buttons">
//         {grades.map((g) => (
//           <button
//             key={g}
//             type="button"
//             className={`filter-btn ${filter === g ? "active" : ""}`}
//             onClick={() => setFilter(g)}
//           >
//             {g}
//           </button>
//         ))}
//       </div>

//       <div className="cards-grid">
//         {filtered.map((item, index) => (
//           <div key={index} className="video-card">
//             <video className="testimonial-video" controls>
//               <source src={item.video} type="video/mp4" />
//             </video>
//             <p className="video-label">{item.name} — {item.grade}</p>
//           </div>
//         ))}
//       </div>

//       <Footer />
//     </div>
//   );
// }

import React, { useState } from "react";
import "./Depoimento.css";
import Footer from "../components/Footer";

// IMPORTANDO VÍDEOS
import depo1 from "../assets/Video1.mp4";
import depo2 from "../assets/Video2.mp4";
import depo3 from "../assets/Video3.mp4";
import depo4 from "../assets/Video4.mp4";
import depo5 from "../assets/Video5.mp4";

export default function Testimonials() {
  const [filter, setFilter] = useState("Todos");

  const data = [
    { 
      name: "João Pedro",
      grade: "1º ANO",
      text: "A professora me ajudou muito com matemática. As aulas são divertidas!",
      color: "#8bc8ff",
      video: depo1
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

  const grades = ["Todos", "1º Ano"];

  const normalize = (str) =>
    String(str)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filtered = filter === "Todos"
    ? data
    : data.filter(item => normalize(item.grade).includes(normalize(filter)));

  return (
    <div className="testimonials-container">
      <h2 className="section-title">O que dizem nossos alunos</h2>

      <div className="filter-buttons">
        {grades.map(g => (
          <button
            key={g}
            type="button"
            className={`filter-btn ${filter === g ? "active" : ""}`}
            onClick={() => setFilter(g)}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="cards-grid">
        {filtered.map((student, index) => (
          <div key={`${student.name}-${index}`} className="testimonial-card">

            <div className="avatar" style={{ background: student.color }}>
              {student.name.charAt(0).toUpperCase()}
            </div>

            <div className="card-info">
              <h3 className="student-name">{student.name}</h3>
              <span className="student-grade">{student.grade}</span>
              <p className="student-text">"{student.text}"</p>

              {/* Vídeo opcional */}
              {student.video && (
                <video className="testimonial-video" controls>
                  <source src={student.video} type="video/mp4" />
                  Seu navegador não suporta vídeos.
                </video>
              )}

              <div className="stars">★★★★★</div>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
