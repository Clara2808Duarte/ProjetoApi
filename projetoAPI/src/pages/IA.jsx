// ===============================
// IMPORTAÇÕES
// ===============================
import { useState, useEffect, useRef } from "react"; 
// useState → gerencia estados das variáveis
// useEffect → executa efeitos colaterais (salvar localStorage, rolar tela)
// useRef → mantém referência a elementos DOM (usado para rolagem)

import Footer from "../components/Footer"; 
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
    const { scrollTop, scrollHeight, clientHeight } = areaConversaRef.current;
    // Calcula quanto falta rolar
    setMostrarBotao(scrollHeight - scrollTop - clientHeight > 100);
    // Mostra botão se faltar mais de 100px para o final
  };

  // ===============================
  // FUNÇÃO PARA GERAR PDF A PARTIR DO MARKDOWN
  // ===============================
  const gerarPdf = (textoMarkdown) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" }); 
    // Cria PDF tamanho A4

    const marginLeft = 40;
    const marginTop = 50;
    const maxWidth = 500;
    let cursorY = marginTop; 
    // Define posição inicial do texto

    // Cores personalizadas para o PDF
    const rosaForte = "#ff4fd8";
    const rosaClaro = "#ff9fee";
    const rosaBullet = "#ff4fd8";
    const textoNormal = "#000000";

    // Função que adiciona uma linha de texto no PDF
    const addLine = (text, size = 12, bold = false, color = textoNormal, extraSpace = 6) => {
      doc.setFont("Helvetica", bold ? "bold" : "normal"); 
      // Define fonte e estilo
      doc.setFontSize(size); // Define tamanho
      doc.setTextColor(color); // Define cor

      const wrapped = doc.splitTextToSize(text, maxWidth); 
      // Quebra a linha se for maior que maxWidth

      // Quebra de página automática
      if (cursorY + wrapped.length * (size + 2) > 800) {
        doc.addPage();
        cursorY = marginTop;
      }

      doc.text(wrapped, marginLeft, cursorY); 
      cursorY += wrapped.length * (size + 2) + extraSpace; 
      // Atualiza posição vertical
    };

    const linhas = textoMarkdown.split("\n"); 
    // Divide Markdown por linhas

    linhas.forEach((linha) => {
      linha = linha.trim(); // Remove espaços extras

      if (linha.startsWith("1. ")) {
        addLine(linha.replace("1. ", ""), 22, true, rosaForte, 12); // Título
      } else if (linha.startsWith("2. ")) {
        addLine(linha.replace("2.", ""), 18, true, rosaClaro, 10); // Subtítulo
      } else if (linha.startsWith("3.")) {
        addLine(linha.replace("3. ", ""), 16, true, rosaClaro, 8); // Sub-subtítulo
      } else if (linha.startsWith("- ")) {
        addLine("• " + linha.replace("- ", ""), 13, false, rosaBullet, 4); // Bullet
      } else if (/\*\*(.*?)\*\*/.test(linha)) {
        const clean = linha.replace(/\*\*(.*?)\*\*/g, "$1");
        addLine(clean, 13, true, rosaForte); // Negrito Markdown
      } else if (linha.length > 0) {
        addLine(linha, 13, false, textoNormal, 6); // Parágrafo normal
      } else {
        cursorY += 10; // Linha vazia
      }
    });

    doc.save("Resposta.pdf"); 
    // Baixa o PDF gerado
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
          {carregando && <div className="msg-typing">Digitando...</div>}
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

      <Footer /> {/* Rodapé */}
    </>
  );
}
