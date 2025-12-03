import React, { useState } from "react";
import "./Depoimento.css";
import Footer from "../components/Footer";

export default function Testimonials() {
  const [filter, setFilter] = useState("Todos");

  const data = [
    { name: "João Pedro", grade: "5º ANO", text: "A professora me ajudou muito com matemática. As aulas são divertidas!", color: "#8bc8ff" },
    { name: "Ana Clara", grade: "3º ANO", text: "Adoro os projetos de artes. Aprendi a me expressar melhor.", color: "#ffb3c8" },
    { name: "Lucas M.", grade: "EX-ALUNO", text: "Sinto saudades das aulas. O Guia me ajudou a organizar meus estudos.", color: "#c9f5dd" },
    { name: "Mariana", grade: "4º ANO", text: "A escola ficou mais legal com as atividades novas.", color: "#ffe59e" },
    { name: "Rafael", grade: "2º ANO", text: "Gosto quando usamos a tecnologia na sala.", color: "#d4c8ff" },
    { name: "Sofia", grade: "5º ANO", text: "A professora entende a gente de verdade.", color: "#ffb3c8" },
  ];

  const grades = ["Todos", "2º Ano", "3º Ano", "4º Ano", "5º Ano", "EX-ALUNO"];

  // Normaliza texto (remove acentos e deixa em lowercase) para comparação confiável
  const normalize = (str) =>
    String(str)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove diacríticos
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

              <div className="stars" aria-hidden>★★★★★</div>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
