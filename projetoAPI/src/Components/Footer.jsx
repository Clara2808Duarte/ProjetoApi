import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-section">
          <h4>Guia Crescer e Aprender</h4>
          <p>Transformando a educação através do afeto, tecnologia e colaboração.</p>
        </div>

        <div className="footer-section">
          <h4>Links Rápidos</h4>
          <ul>
            <li><Link to="/calendario">Calendário Escolar</Link></li>
            <li><Link to="/ia">IA Pedagógica</Link></li>
            <li><Link to="/asgatitas">Colaboradores</Link></li>
          </ul>
        </div>

        <div className="footer-section">
      
          <h4>Colaboradoras:</h4>
         <ul>
            <li>Giovanna Ferreira</li>
            <li>Julia Piazzoli</li>
            <li>Kamilly Barra</li>
            <li>Maria Clara Duarte</li>
        </ul>
        </div>

      </div>
      
      <div className="footer-copy">
        <br/> 
        <br/>
        <br/>
        © 2024 Guia Crescer e Aprender. Todos os direitos reservados.
      </div>
    </footer>
  );
}
