const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyCTC67NqA3nB3NwV1A1n49N6s2wkLMFM5Q";

// Rota do chat educacional
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res
      .status(400)
      .json({ error: "Envie a mensagem no corpo da requisição." });
  }

  try {
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

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

    const reply =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sem resposta.";

    res.json({ reply });
  } catch (error) {
    console.error("Erro no Gemini:", error?.response?.data || error.message);
    res.status(500).json({ error: "Erro ao se comunicar com o Gemini." });
  }
});

app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});
