import { Link } from "react-router-dom";
import "./NavBar.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


export default function NavBar() {
  return (
    <>
    <nav className="navbar">
      {/* LOGO */}
      <div className="navbar-logo">
        <div className="logo-box">GC</div>
        <span className="logo-text">
          Guia<span>Crescer</span>
        </span>
      </div>

      {/* LINKS */}
      <ul className="navbar-links">
        <li>
          <Link to="/">
            <i className="fas fa-heart"></i> Início
          </Link>
        </li>

        <li>
          <Link to="/professora">
            <i className="fas fa-user"></i> Professora
          </Link>
        </li>

        <li>
          <Link to="/calendario">
            <i className="fas fa-calendar"></i> Calendário
          </Link>
        </li>

        <li>
          <Link to="/depoimentos">
            <i className="fas fa-comment-dots"></i> Depoimentos
          </Link>
        </li>

        <li>
          <Link to="/asgatitas">
            <i className="fas fa-users"></i> Colaboradoras
          </Link>
        </li>
      </ul>

      <Link to="/ia" className="ia-btn">
        <i className="fas fa-bolt"></i>
        IA Especialista
      </Link>
    </nav>
    </>
  );
}