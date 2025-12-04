import "./SobreProfessora.css";
import Footer from "../components/Footer";
import Professora from "../assets/FotoDocente.jpeg";


export default function ProfileCard() {
  return (
    <>
    <div className="profile-container">
      <div className="profile-content">
        <div className="avatar">
        <img src={Professora} alt="Foto da Professora Eunice" />
        </div>

        <div className="info">
          <div className="bar"></div>
          <h3>Profa. Paloma Pereira</h3>

          <p className="description">
            Com mais de 5 anos de experiência em Educação Infantil e Ensino
            Fundamental, acredito que a educação deve ser acolhedora e
            inclusiva. Minha missão é transformar a sala de aula em um ambiente
            de descoberta e respeito mútuo.
          </p>

          <div className="tags">
            <span>Pedagoga</span>
            <span>Educação Infantil</span>
            <span>Especialista em Alfabetização</span>
          </div>
        </div>
      </div>

      <div className="bottom-buttons">
        <button>Aulas Lúdicas</button>
        <button>Inclusão Escolar</button>
      </div>
       </div>

       <Footer />
    </>
  );
}
