import "./SobreNos.css";
import Giovanna from "../assets/Giovanna.jpeg";
import Julia from "../assets/Julia.jpeg";
import Kamilly from "../assets/Kamilly.jpeg";
import Duarte from "../assets/Duarte.jpeg";
import Footer from "../components/Footer";
import Nav from "../components/NavBar";


const integrantes = [
  {
    nome: "GIOVANNA FERREIRA",
    imagem: Giovanna,
    cls: "cards-1"
  },
  {
    nome: "MARIA CLARA DUARTE",
    imagem: Duarte,
    cls: "cards-3"
  },
  {
    nome: "JULIA PIAZZOLI  DOMENEGHETTI",
    imagem: Julia,
    cls: "cards-2"
  },
  {
    nome: "KAMILLY EDUARDA SILVA BARRA",
    imagem: Kamilly,
    cls: "cards-0"
  },
];

function Us() {
  return (
    <>
    <div className="contnr">
      <h1 className="tit"> INTEGRANTES DO GRUPO </h1>
      <p className="subtit">
        As gatitas são um grupo cheio de vida, risadas e cumplicidade. 
        Cada uma tem seu jeitinho único — e juntas, formam uma mistura perfeita de carinho, fé e amizade verdadeira. 
        Entre conversas, sonhos e planos, elas se apoiam, se divertem e tornam cada momento mais especial.
      </p>

      <br/>

      <div className="gridd">
  {integrantes.map((pessoa, index) => (
    <div key={index} className={`cards card-${index}`}>
      <div className="imag-conter">
        <img src={pessoa.imagem} alt={pessoa.nome} />
        <div className="glow"></div>
      </div>
      <h2 className="nome">{pessoa.nome}</h2>
      <p className="desc">{pessoa.descricao}</p>
    </div>
        ))}

        <br />

      </div>
    </div>
    <Footer />
    </>
  );
}

export default Us