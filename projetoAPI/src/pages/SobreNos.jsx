import "./SobreNos.css";
import Giovanna from "../assets/Giovanna.jpeg";
import Julia from "../assets/Julia.jpeg";
import Kamilly from "../assets/Kamilly.jpeg";
import Duarte from "../assets/Duarte.jpeg";
import Footer from "../components/Footer";


const integrantes = [
  {
    nome: "GIOVANNA FERREIRA",
    imagem: Giovanna,
    cls: "cards-1",
  },
  {
    nome: "MARIA CLARA DUARTE",
    imagem: Duarte,
    cls: "cards-3",
  },
  {
    nome: "JULIA PIAZZOLI  DOMENEGHETTI",
    imagem: Julia,
    cls: "cards-2",
  },
  {
    nome: "KAMILLY EDUARDA SILVA BARRA",
    imagem: Kamilly,
    cls: "cards-0",
  },
];

function Us() {
  return (
    <>
      <div className="contnr">
        <h1 className="tit"> INTEGRANTES DO GRUPO </h1>
        <p className="subtit">
          As gatitas são um grupo cheio de vida, risadas e cumplicidade. Cada
          uma tem seu jeitinho único — e juntas, formam uma mistura perfeita de
          carinho, fé e amizade verdadeira. Entre conversas, sonhos e planos,
          elas se apoiam, se divertem e tornam cada momento mais especial.
        </p>

        <br />

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
        </div>

        <br />

        <p className="subtit">
          Este projeto foi desenvolvido no âmbito do curso Desenvolvimento de
          Sistemas do SENAI, como trabalho final integrador. A proposta surgiu a
          partir de uma parceria com a professora Eunice, docente do 1º ano do
          Ensino Fundamental do SESI, com o objetivo de criar soluções
          tecnológicas que contribuíssem diretamente para o seu cotidiano
          escolar. Ao longo do desenvolvimento, nossa equipe construiu um
          conjunto de ferramentas digitais que atendem às principais
          necessidades identificadas pela professora. Entre elas, destaca-se uma
          IA generativa, criada para oferecer suporte em suas atividades
          pedagógicas, respondendo dúvidas e auxiliando na elaboração de
          conteúdos relacionados às disciplinas que ela trabalha diariamente.
          Além disso, implementamos um calendário funcional, no qual a
          professora pode registrar e organizar eventos escolares, feriados,
          atividades importantes e demais compromissos. O projeto também conta
          com uma página de depoimentos, onde os alunos compartilham suas
          percepções sobre as aulas, sobre o método de ensino utilizado pela
          professora Eunice e sobre sua atuação pessoal. Esse espaço foi pensado
          como uma forma de valorizar o vínculo entre professora e estudantes,
          além de oferecer um retorno autêntico sobre sua prática pedagógica.
          Assim, o projeto integra tecnologia, organização e interação, buscando
          facilitar a rotina da professora Eunice e fortalecer o ambiente
          educativo de forma simples, eficiente e inovadora.
        </p>
      </div>
      <Footer />
    </>
  );
}

export default Us;
