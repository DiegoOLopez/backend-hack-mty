const express = require('express');

const router = express.Router();
const axios = require('axios');


const { OpenRouterService } = require('./../services/openrouter.service')

const service = new OpenRouterService(process.env.OPENROUTER_API_KEY);


// endpoint para IA de OpenRouter
router.get("/", async (req, res) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o",
        messages: [
          { role: "user", content: "dame un hola mundo en java" }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extraemos la respuesta del asistente
    const botMessage = response.data.choices?.[0]?.message?.content || "No hay respuesta";

    res.json({ botMessage, raw: response.data });
  } catch (err) {
    console.error("Error probando OpenRouter:", err.response?.data || err.message);
    res.status(500).json({ error: "Error en OpenRouter", details: err.response?.data || err.message });
  }
});


router.post("/", async (req, res) => {
  const { message } = req.body;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    for await (const chunk of service.streamCompletion(message)) {
      res.write(`data: ${chunk}\n\n`);
    }
    res.write("event: done\ndata: [DONE]\n\n");
  } catch (err) {
    console.error("Error:", err.message);
    res.write(`data: Error: ${err.message}\n\n`);
  } finally {
    res.end();
  }
});




module.exports = router;