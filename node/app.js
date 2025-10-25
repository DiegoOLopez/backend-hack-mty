// app.js
import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import { speechToText, textToSpeech } from "./services/elevenlabs.js";
import { askAI } from "./services/openrouter.js";

dotenv.config();
const app = express();
const upload = multer();

app.use(express.json());

/**
 * Endpoint principal:
 * 1. Recibe audio del usuario
 * 2. Convierte voz → texto (ElevenLabs)
 * 3. Procesa texto con IA (OpenRouter)
 * 4. Convierte respuesta texto → voz (ElevenLabs)
 * 5. Devuelve el audio de respuesta
 */
app.post("/voice", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se envió archivo de audio." });
    }

    console.log("🎧 Recibiendo audio del usuario...");

    // 1️⃣ Voz a texto
    const userText = await speechToText(req.file.buffer);
    console.log("📝 Texto detectado:", userText);

    // 2️⃣ IA procesa el texto
    const aiResponse = await askAI(userText);
    console.log("🤖 Respuesta IA:", aiResponse);

    // 3️⃣ Texto a voz
    const audioPath = await textToSpeech(aiResponse);

    // 4️⃣ Devolver audio resultante
    const audioData = fs.readFileSync(audioPath);
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audioData);
  } catch (error) {
    console.error("❌ Error general:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`)
);
