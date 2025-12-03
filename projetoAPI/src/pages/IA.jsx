// IA_Axios.jsx
import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import axios from "axios";
import "../pages/ia.css";

// ===============================
// Chaves da Gemini API
// ===============================
const apiKeys = [
  import.meta.env.VITE_API_CAGNIN,
  import.meta.env.VITE_API_FELIPE,
  import.meta.env.VITE_API_KNIGHT
];

// ===============================
// Função para gerar resposta do Gemini
// ===============================
async function gerarAtividadeHistoria(message) {
  if (!message) return "Envie uma mensagem válida.";

  const prompt = `
    Você é um assistente pedagógico especializado em fundamental 1 (1º ao 5º ano do ensino básico), com foco nas disciplinas 
    de ciências, matemática, língua portuguesa, história e geografia.
    Suas funções:

    **Responder SOMENTE assuntos educacionais.**
    - Caso a mensagem fuja do tema (romance, fofoca, crimes, conversas aleatórias etc.),
      responda apenas:
      **"Este chat é exclusivo para assuntos educacionais."**

    **Apoio a estudantes neurodivergentes**:
    Para perguntas relacionadas a TDAH, TEA, dislexia, altas habilidades
    ou outras neurodivergências, siga sempre estes princípios:
    - Explique de forma clara, estruturada e acolhedora.
    - Use linguagem simples.
    - Sugira técnicas de ensino diferenciadas.
    - Nunca forneça diagnóstico.
    - Ajude na adaptação de atividades e planejamento pedagógico.
    - Proponha alternativas multisensoriais, visuais ou práticas.
    
    **Apoio ao professor**:
    Quando o usuário pedir ajuda para aula:
    - Sugira atividades práticas.
    - Crie planos de aula.
    - Organize conteúdos por nível de ensino.
    - Ofereça atividades adaptadas para alunos neurodivergentes.
    - Forneça explicações curtas, médias ou longas conforme o pedido.
    
    **Formato da resposta**:
    Sempre responda com organização, usando:
    - Títulos
    - Subtópicos
    - Listas
    - Exemplos claros

    **Mensagem do usuário**:
    "${message}"
  `;

  let respostaIA = "Erro ao gerar resposta.";

  for (let key of apiKeys) {
    try {
      const res = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: {"Content-Type": "application/json"},
          params: {key},
      );

      respostaIA = res.data.candidates?.[0]?.content?.[0]?.text || respostaIA;
      break; // deu certo → sai do loop
    } catch (err) {
      console.warn(`Erro com a chave ${key}, tentando a próxima...`, err);
    }
  }

  return respostaIA;
}

// ===============================
// Componente IA
// ===============================
export default function IA() {
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarBotao, setMostrarBotao] = useState(false);
  const [conversa, setConversa] = useState(() => {
    const salva = localStorage.getItem("chat_pedagogico");
    if (salva) return JSON.parse(salva);
    return [
      {
        remetente: "bot",
        texto:
          "Olá! Sou sua assistente pedagógica. Pergunte sobre rotinas escolares, planos de aula, estratégias de ensino e apoio a estudantes neurodivergentes.",
        inicial: true,
      },
    ];
  });

  const areaConversaRef = useRef(null);

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

    const rosaForte = "#ff4fd8";
    const rosaClaro = "#ff9fee";
    const rosaBullet = "#ff4fd8";
    const textoNormal = "#000000";

    const addLine = (text, size = 12, bold = false, color = textoNormal, extraSpace = 6) => {
      doc.setFont("Helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.setTextColor(color);

      const wrapped = doc.splitTextToSize(text, maxWidth);
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
      if (linha.startsWith("1. ")) addLine(linha.replace("1. ", ""), 22, true, rosaForte, 12);
      else if (linha.startsWith("2. ")) addLine(linha.replace("2.", ""), 18, true, rosaClaro, 10);
      else if (linha.startsWith("3.")) addLine(linha.replace("3. ", ""), 16, true, rosaClaro, 8);
      else if (linha.startsWith("- ")) addLine("• " + linha.replace("- ", ""), 13, false, rosaBullet, 4);
      else if (/\*\*(.*?)\*\*/.test(linha)) addLine(linha.replace(/\*\*(.*?)\*\*/g, "$1"), 13, true, rosaForte);
      else if (linha.length > 0) addLine(linha, 13, false, textoNormal, 6);
      else cursorY += 10;
    });

    doc.save("Resposta.pdf");
  };

  // ============================================
  // ENVIAR MENSAGEM
  // ============================================
  const enviarMensagem = async () => {
    if (!mensagem.trim()) return;

    const novaConversa = [...conversa, { remetente: "user", texto: mensagem }];
    setMensagem("");
    setConversa(novaConversa);

    try {
      setCarregando(true);
      const resposta = await gerarAtividadeHistoria(mensagem);

      setConversa((prev) => [
        ...prev,
        { remetente: "bot", texto: resposta, inicial: false },
      ]);
    } catch (error) {
      setConversa((prev) => [
        ...prev,
        { remetente: "bot", texto: "Erro ao conectar à API.", inicial: false },
      ]);
    }

    setCarregando(false);
  };

  // ============================================
  // LIMPAR CHAT
  // ============================================
  const limparChat = () => {
    if (!window.confirm("Tem certeza que deseja apagar toda a conversa?")) return;

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

          <button className="clear-button" onClick={limparChat}>
            Limpar
          </button>
        </div>

        <div ref={areaConversaRef} onScroll={handleScroll} className="chat-area">
          {conversa.map((msg, index) => (
            <div
              key={index}
              className={`msg-bubble ${msg.remetente === "user" ? "msg-user" : "msg-bot"}`}
            >
              <ReactMarkdown>{msg.texto}</ReactMarkdown>

              {msg.remetente === "bot" && !msg.inicial && (
                <button className="pdf-button" onClick={() => gerarPdf(msg.texto)}>
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
            placeholder="Ex: Por favor, me ajude a criar um plano de aula para o 4º ano sobre o ciclo da água."
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
