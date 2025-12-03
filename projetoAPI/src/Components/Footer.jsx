import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h4>Guia Crescer e Aprender</h4>
        <p>Transformando a educação através do afeto, técnica e colaboração.</p>
      </div>

      <div className="footer-section">
        <h4>Links Rápidos</h4>
        <ul>
          <li>
          <Link to="/calendario">
            <i></i> Calendário Pedagógico
          </Link>
        </li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>Colaboradores</h4>
        <ul>
          <li>Giovanna Ferreira</li>
          <li>Julisa Piazzoli</li>
          <li>Kemilly Barra</li>
          <li>Maria Duarte</li>
        </ul>
      </div>
    </footer>
  );
}
