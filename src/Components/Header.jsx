import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">
          Guia <span className="highlight">Crescer</span> e Aprender
        </h1>

        <p className="hero-subtitle">
          Apoio pedagógico, saúde emocional e estratégias para um futuro brilhante.
        </p>

        <div className="hero-buttons">

          {/* Botão IA */}
          <Link to="/ia" className="btn-ia">
            <i className="fas fa-bolt"></i> Pergunte para a IA
          </Link>

          {/* Botão Professora */}
          <Link to="/professora" className="btn-prof">
            Conheça a Professora
          </Link>

        </div>
      </div>
    </header>
  );
}