import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import "../pages/ia.css";
import { enviarParaGemini } from "../backend/server";


export default function IA() {
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarBotao, setMostrarBotao] = useState(false);
  const areaConversaRef = useRef(null);

  // ===============================
  // 🔥 CARREGAR CONVERSA DO STORAGE
  // ===============================
  const [conversa, setConversa] = useState(() => {
    const salva = localStorage.getItem("chat_pedagogico");

    if (salva) {
      return JSON.parse(salva);
    }

    // Se não existir nada salvo → coloca a mensagem de boas-vindas
    return [
      {
        remetente: "bot",
        texto:
          "Olá! Sou sua assistente pedagógica. Pergunte sobre rotinas escolares, planos de aula, estratégias de ensino e apoio a estudantes neurodivergentes.",
        inicial: true,
      },
    ];
  });

  // 🔥 Sempre que a conversa mudar → salvar no localStorage
  useEffect(() => {
    localStorage.setItem("chat_pedagogico", JSON.stringify(conversa));
  }, [conversa]);

  const scrollToBottom = () => {
    if (areaConversaRef.current) {
      areaConversaRef.current.scrollTo({
        top: areaConversaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversa, carregando]);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = areaConversaRef.current;
    setMostrarBotao(scrollHeight - scrollTop - clientHeight > 100);
  };

  // ============================================
  // PDF AUTOMÁTICO
  // ============================================
const gerarPdf = (textoMarkdown) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const marginLeft = 40;
  const marginTop = 50;
  const maxWidth = 500;
  let cursorY = marginTop;

  // === SUAS CORES ===
  const rosaForte = "#ff4fd8";
  const rosaClaro = "#ff9fee";
  const rosaBullet = "#ff4fd8";
  const textoNormal = "#000000";

  const addLine = (text, size = 12, bold = false, color = textoNormal, extraSpace = 6) => {
    doc.setFont("Helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);

    const wrapped = doc.splitTextToSize(text, maxWidth);

    // Quebra de página
    if (cursorY + wrapped.length * (size + 2) > 800) {
      doc.addPage();
      cursorY = marginTop;
    }

    doc.text(wrapped, marginLeft, cursorY);
    cursorY += wrapped.length * (size + 2) + extraSpace;
  };

  const linhas = textoMarkdown.split("\n");

  linhas.forEach((linha) => {
    linha = linha.trim();

    // # Título
    if (linha.startsWith("1. ")) {
      addLine(
        linha.replace("1. ", ""),
        22,
        true,
        rosaForte,
        12
      );
    }

    // ## Subtítulo
    else if (linha.startsWith("2. ")) {
      addLine(
        linha.replace("2.", ""),
        18,
        true,
        rosaClaro,
        10
      );
    }

    // ### Sub-subtítulo
    else if (linha.startsWith("3.")) {
      addLine(
        linha.replace("3. ", ""),
        16,
        true,
        rosaClaro,
        8
      );
    }

    // - Lista
    else if (linha.startsWith("- ")) {
      addLine(
        "• " + linha.replace("- ", ""),
        13,
        false,
        rosaBullet,
        4
      );
    }

    // Negrito Markdown **texto**
    else if (/\*\*(.*?)\*\*/.test(linha)) {
      const clean = linha.replace(/\*\*(.*?)\*\*/g, "$1");
      addLine(clean, 13, true, rosaForte);
    }

    // Parágrafo normal
    else if (linha.length > 0) {
      addLine(linha, 13, false, textoNormal, 6);
    }

    // Linha vazia
    else {
      cursorY += 10;
    }
  });

  doc.save("Resposta.pdf");
};


  // ============================================
  // ENVIAR MENSAGEM AO SERVIDOR
  // ============================================
 const enviarMensagem = async () => {
  if (!mensagem.trim()) return;

  const novaConversa = [...conversa, { remetente: "user", texto: mensagem }];
  setMensagem("");
  setConversa(novaConversa);
  setCarregando(true);

  try {
    const respostaIA = await enviarParaGemini(mensagem);

  setConversa((prev) => [
  ...prev,
  { remetente: "bot", texto: respostaIA || "Sem resposta da IA.", inicial: false },
]);

  } catch (error) {
    setConversa((prev) => [
      ...prev,
      {
        remetente: "bot",
        texto: "Erro ao conectar à IA.",
        inicial: false,
      },
    ]);
  }

  setCarregando(false);
};

  // ============================================
  // 🧹 LIMPAR CHAT
  // ============================================
  const limparChat = () => {
    if (!window.confirm("Tem certeza que deseja apagar toda a conversa?"))
      return;

    const conversaInicial = [
      {
        remetente: "bot",
        texto:
          "Olá! Sou sua assistente pedagógica. Pergunte sobre rotinas escolares, planos de aula, estratégias de ensino e apoio a estudantes neurodivergentes.",
        inicial: true,
      },
    ];

    setConversa(conversaInicial);
    localStorage.setItem("chat_pedagogico", JSON.stringify(conversaInicial));
  };

  return (
    <>
      <div className="chat-container">
        <div className="chat-header">
          IA Pedagógica
          <div className="chat-subtitle">
            Especialista em Educação & Desenvolvimento
          </div>

          {/* BOTÃO LIMPAR CHAT */}
          <button className="clear-button" onClick={limparChat}>
           Limpar
          </button>
        </div>

        <div
          ref={areaConversaRef}
          onScroll={handleScroll}
          className="chat-area"
        >
          {conversa.map((msg, index) => (
            <div
              key={index}
              className={`msg-bubble ${
                msg.remetente === "user" ? "msg-user" : "msg-bot"
              }`}
            >
              <ReactMarkdown>{msg.texto}</ReactMarkdown>

              {msg.remetente === "bot" && !msg.inicial && (
                <button
                  className="pdf-button"
                  onClick={() => gerarPdf(msg.texto)}
                >
                  📄 Baixar PDF
                </button>
              )}
            </div>
          ))}

          {carregando && <div className="msg-typing">Digitando...</div>}
        </div>

        {mostrarBotao && (
          <button className="scroll-button" onClick={scrollToBottom}>
            ⬇
          </button>
        )}

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

      <Footer />
    </>
  );
}
