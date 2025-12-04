import "./SobreProfessora.css";
import Footer from "../components/Footer";
import Professora from "../assets/ProfessoraEunice.jpeg";


export default function ProfileCard() {
  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="avatar">
        <img src={Professora} alt="Foto da Professora Eunice" />
        </div>

        <div className="info">
          <div className="bar"></div>
          <h3>Professora Eunice Alves</h3>

          <p className="descricao">
            Eunice Alves de Souza Camargo, 55 anos, construiu uma trajetória marcada pelo cuidado com a infância. Graduada em Pedagogia pela Anhanguera e com pós-graduação em Psicopedagogia, Alfabetização e Letramento, ela sempre foi movida pelo profundo gosto pela aprendizagem infantil, especialmente na primeira fase da educação.

            Foram 11 anos de formação que a levaram até a sala de aula, onde viveu uma primeira experiência desafiadora — a gestão da turma, segundo ela, é algo que só se aprende com o tempo. Hoje, Eunice reconhece a importância dos estudos voltados à aprendizagem na primeira infância e continua inquieta e curiosa, desejando iniciar uma pós-graduação em Neurociência para compreender ainda mais o desenvolvimento das crianças.

            Sua caminhada revela uma educadora dedicada, que transforma o aprender em um ato de cuidado e crescimento.
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
      <br/>
      <br/>
      <br/>
            <Footer/>
      </div>
      
  );
}
