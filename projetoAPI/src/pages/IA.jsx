// ===============================
// IMPORTAÇÕES
// ===============================
import { useState, useEffect, useRef } from "react"; 
// useState → gerencia estados das variáveis
// useEffect → executa efeitos colaterais (salvar localStorage, rolar tela)
// useRef → mantém referência a elementos DOM (usado para rolagem)

// import Footer from "../components/Footer"; 
// Componente Footer que exibe o rodapé da página

import ReactMarkdown from "react-markdown"; 
// Renderiza Markdown em HTML para exibir na conversa

import jsPDF from "jspdf"; 
// Biblioteca para gerar PDF diretamente no frontend

import "../pages/ia.css"; 
// CSS da página de chat

import { enviarParaGemini } from "../backend/server"; 
// Função que envia mensagem para a IA (backend)

// ===============================
// COMPONENTE PRINCIPAL
// ===============================
export default function IA() {
  // ===============================
  // ESTADOS PRINCIPAIS
  // ===============================
  const [mensagem, setMensagem] = useState(""); 
  // Armazena a mensagem digitada pelo usuário

  const [carregando, setCarregando] = useState(false); 
  // Indica se a IA está "digitando" (loading)

  const [mostrarBotao, setMostrarBotao] = useState(false); 
  // Mostra ou esconde o botão de rolar para o final

  const areaConversaRef = useRef(null); 
  // Referência da div da conversa para manipular rolagem

  // ===============================
  // CARREGAR CONVERSA DO LOCALSTORAGE
  // ===============================
  const [conversa, setConversa] = useState(() => {
    const salva = localStorage.getItem("chat_pedagogico"); 
    // Tenta recuperar conversa salva no navegador

    if (salva) {
      return JSON.parse(salva); 
      // Converte de JSON para objeto JS
    }

    // Se não existir conversa salva → mensagem inicial
    return [
      {
        remetente: "bot",
        texto:
          "Olá! Sou sua assistente pedagógica. Pergunte sobre rotinas escolares, planos de aula, estratégias de ensino e apoio a estudantes neurodivergentes.",
        inicial: true, 
        // Marca como mensagem inicial para não exibir PDF
      },
    ];
  });

  // ===============================
  // SALVAR CONVERSA NO LOCALSTORAGE
  // ===============================
  useEffect(() => {
    localStorage.setItem("chat_pedagogico", JSON.stringify(conversa)); 
    // Atualiza localStorage sempre que a conversa muda
  }, [conversa]);

  // ===============================
  // ROLAR AUTOMATICAMENTE PARA O FINAL
  // ===============================
  const scrollToBottom = () => {
    if (areaConversaRef.current) {
      areaConversaRef.current.scrollTo({
        top: areaConversaRef.current.scrollHeight, 
        // Rola até o final da conversa
        behavior: "smooth", 
        // Rolagem suave
      });
    }
  };

  useEffect(() => {
    scrollToBottom(); 
    // Rola para baixo sempre que conversa ou carregando mudar
  }, [conversa, carregando]);

  // ===============================
  // MOSTRAR BOTÃO DE ROLAR PARA BAIXO SE NECESSÁRIO
  // ===============================
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = areaConversaRef.current; // Obtém valores de rolagem
    // Calcula quanto falta rolar
    setMostrarBotao(scrollHeight - scrollTop - clientHeight > 100); // Mostra botão se faltar mais de 100px para o final
    // Mostra botão se faltar mais de 100px para o final
  };

  // ===============================
  // FUNÇÃO PARA GERAR PDF A PARTIR DO MARKDOWN
  // ===============================
// Função principal que gera o PDF
const gerarPdf = (textoMarkdown) => {

  // Cria o documento PDF no formato A4 usando pontos (pt) como unidade
  const doc = new jsPDF({ 
    unit: "pt", // Unidade em pontos
    format: "a4" // Formato A4
  });

  // Margem esquerda
  const marginLeft = 40;
  // Margem superior do PDF
  const marginTop = 40;
  // Largura máxima que o texto pode ocupar antes de quebrar linha
  const maxWidth = 500;
  // Controla a posição vertical atual dentro da página
  let cursorY = marginTop;

  // -------- CORES DO PDF --------

  const rosaForte = "#d92fb0";  // Usado para títulos principais
  const rosaClaro = "#ff7be3";  // Usado para subtítulos
  const textoNormal = "#000";   // Cor do texto normal (parágrafos)

  // -------- TAMANHOS DE FONTE --------
  // Estes valores foram ajustados para ficar proporcional ao tamanho da página A4

  const FONT_TITLE = 13;        // Título nível 1
  const FONT_SUBTITLE = 11;     // Título nível 2
  const FONT_SUBSUB = 10;       // Título nível 3
  const FONT_PARAGRAPH = 8;     // Parágrafo
  const FONT_BULLET = 8;        // Lista
  const FONT_BOLD = 8;          // Negrito

  // Função que desenha uma linha ou parágrafo dentro do PDF
  const addLine = (text, size = FONT_PARAGRAPH, bold = false, color = textoNormal, extraSpace = 2) => {

    // Define a fonte: Helvetica normal ou Helvetica bold
    doc.setFont("Helvetica", bold ? "bold" : "normal");

    // Define o tamanho da fonte
    doc.setFontSize(size);

    // Define a cor do texto
    doc.setTextColor(color);

    // Quebra o texto automaticamente para cabe no maxWidth
    const wrapped = doc.splitTextToSize(text, maxWidth);

    // Se o texto vai ultrapassar o limite da página (posição 780)
    if (cursorY + wrapped.length * (size + 2) > 780) {
      // Cria uma nova página
      doc.addPage();
      // Reseta a altura para o topo da nova página
      cursorY = marginTop;
    }

    // Escreve o texto no PDF na posição atual
    doc.text(wrapped, marginLeft, cursorY);

    // Move o cursor vertical para a próxima linha/parágrafo
    cursorY += wrapped.length * (size + 2) + extraSpace;
  };

  // Divide o markdown em linhas
  const linhas = textoMarkdown.split("\n");

  // Processa cada linha separadamente
  linhas.forEach((linha) => {

    // Remove espaços desnecessários nas pontas
    linha = linha.trim();

    // ---------- TITULO NIVEL 1 (1. ) ----------
    if (linha.startsWith("1. ")) {
      addLine(linha.replace("1. ", ""), FONT_TITLE, true, rosaForte, 8);
      return; // vai para a próxima linha
    }

    // ---------- TITULO NIVEL 2 (2. ) ----------
    if (linha.startsWith("2. ")) {
      addLine(linha.replace("2. ", ""), FONT_SUBTITLE, true, rosaClaro, 6);
      return;
    }

    // ---------- TITULO NIVEL 3 (3. ) ----------
    if (linha.startsWith("3. ")) {
      addLine(linha.replace("3. ", ""), FONT_SUBSUB, true, rosaClaro, 4);
      return;
    }

    // ---------- LISTA (- ) ----------
    if (linha.startsWith("- ")) {
      addLine("• " + linha.replace("- ", ""), FONT_BULLET, false, textoNormal,  2);
      return;
    }

    // ---------- NEGRITO (**texto**) ----------
    if (/\*\*(.*?)\*\*/.test(linha)) {
      // Remove os asteriscos e mantém só o texto
      const clean = linha.replace(/\*\*(.*?)\*\*/g, "$1");
      addLine(clean, FONT_BOLD, true, textoNormal, 2);
      return;
    }

    // ---------- PARÁGRAFO NORMAL ----------
    if (linha.length > 0) {
      addLine(linha, FONT_PARAGRAPH, false, textoNormal, 2);
      return;
    }

    // ---------- LINHA VAZIA ----------
    cursorY += 6;
  });

  // Salva o arquivo com o nome informado
  doc.save("Resposta.pdf");
};


  // ===============================
  // FUNÇÃO PARA ENVIAR MENSAGEM AO SERVIDOR (IA)
  // ===============================
  const enviarMensagem = async () => {
    if (!mensagem.trim()) return; // Ignora mensagem vazia

    const novaConversa = [...conversa, { remetente: "user", texto: mensagem }];
    setMensagem(""); // Limpa input
    setConversa(novaConversa); // Atualiza estado
    setCarregando(true); // Mostra "digitando..."

    try {
      const respostaIA = await enviarParaGemini(mensagem); 
      // Chama backend da IA

      setConversa((prev) => [
        ...prev,
        { remetente: "bot", texto: respostaIA || "Sem resposta da IA.", inicial: false },
      ]); 
      // Adiciona resposta da IA
    } catch (error) {
      setConversa((prev) => [
        ...prev,
        { remetente: "bot", texto: "Erro ao conectar à IA.", inicial: false },
      ]); 
      // Mostra erro caso falhe
    }

    setCarregando(false); // Remove indicador "digitando"
  };

  // ===============================
  // LIMPAR CHAT
  // ===============================
  const limparChat = () => {
    if (!window.confirm("Tem certeza que deseja apagar toda a conversa?")) return;
    // Confirmação para evitar apagar acidentalmente

    const conversaInicial = [
      {
        remetente: "bot",
        texto:
          "Olá! Sou sua assistente pedagógica. Pergunte sobre rotinas escolares, planos de aula, estratégias de ensino e apoio a estudantes neurodivergentes.",
        inicial: true,
      },
    ];

    setConversa(conversaInicial); // Reseta conversa
    localStorage.setItem("chat_pedagogico", JSON.stringify(conversaInicial)); 
    // Reseta localStorage
  };

  // ===============================
  // JSX — ESTRUTURA DO CHAT
  // ===============================
  return (
    <>

      <div className="chat-container">
        <div className="chat-header">
          IA Pedagógica
          <div className="chat-subtitle">
            Especialista em Educação & Desenvolvimento
          </div>

          {/* Botão para limpar conversa */}
          <button className="clear-button" onClick={limparChat}>
            Limpar
          </button>
        </div>

        {/* Área da conversa */}
        <div ref={areaConversaRef} onScroll={handleScroll} className="chat-area">
          {conversa.map((msg, index) => (
            <div key={index} className={`msg-bubble ${msg.remetente === "user" ? "msg-user" : "msg-bot"}`}>
              <ReactMarkdown>{msg.texto}</ReactMarkdown>

              {/* Botão PDF apenas para mensagens da IA */}
              {msg.remetente === "bot" && !msg.inicial && (
                <button className="pdf-button" onClick={() => gerarPdf(msg.texto)}>
                  📄 Baixar PDF
                </button>
              )}
            </div>
          ))}

          {/* Indicador "digitando" */}
          {carregando && <div className="msg-typing">Gerando Resposta...</div>}
        </div>

        {/* Botão rolar para o final */}
        {mostrarBotao && (
          <button className="scroll-button" onClick={scrollToBottom}>
            ⬇
          </button>
        )}

        {/* Input e botão enviar */}
        <div className="chat-input-area">
          <input
            className="chat-input"
            placeholder="Ex: Crie um plano de aula para o 4º ano sobre o ciclo da água."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
          />

          <button className="chat-send-button" onClick={enviarMensagem}>
            ➤
          </button>
        </div>
      </div>

      {/* <Footer /> Rodapé */}
    </>
  );
}
