// server.js

// Importa a biblioteca axios para fazer requisições HTTP
import axios from "axios";

// 📌 Pega a chave da API do arquivo .env
// import.meta.env é usado em projetos Vite
const API_KEY = import.meta.env.VITE_API_GEMINI;

// Função que envia uma mensagem para o modelo Gemini
// Ela é assincrona porque faz uma requisição externa
export async function enviarParaGemini(message) {

  // Se a mensagem vier vazia, retorna aviso
  if (!message) return "Envie uma mensagem válida.";

  // Prompt principal enviado ao modelo
  // Define as regras do comportamento da IA
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

  try {

    // Faz a requisição POST para a API do Gemini
    const res = await axios.post(
      // Endpoint do modelo Gemini específico que você está usando
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",

      // Corpo da requisição
      {
        contents: [
          {
            parts: [{ text: prompt }] // Texto que a IA irá processar
          }
        ]
      },

      // Configurações adicionais da requisição
      {
        headers: { "Content-Type": "application/json" }, // Diz que o corpo é JSON
        params: { key: API_KEY } // Passa a chave da API pela URL
      }
    );

    // Tenta acessar a resposta gerada pela IA
    // A estrutura é extensa, por isso usamos optional chaining (?.)
    const texto = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Se existir texto retornado, envia para o usuário
    return texto || "Nenhuma resposta recebida da IA.";

  } catch (err) {
    // Se aconteceu algum erro na requisição, mostra no console
    console.error("Erro ao chamar a API:", err);

    // Retorna um aviso para o usuário
    return "Erro ao conectar à IA.";
  }
}
