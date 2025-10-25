//sst-tts.routes.js     
const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const { speechToText, textToSpeech } = require('../services/elevenlabs.service.js');
const { getResponse } = require('../services/openrouter.service.js');
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');


dotenv.config();
const router = express.Router();
const upload = multer({ dest: "uploads/" });
const PORT = process.env.PORT || 3000;

// Inicializamos el cliente de ElevenLabs
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

router.use(express.json());

/*// Endpoint de voice-chat existente
router.post("/voice-chat", upload.single("audio"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Se requiere archivo de audio" });

  try {
    // Convertir voz a texto
    const userText = await speechToText(req.file.path);

    // Obtener respuesta de OpenRouter
    const botResponse = await getResponse(userText);

    // Convertir respuesta a voz
    const audioFile = await textToSpeech(botResponse);

    res.download(audioFile, "response.mp3");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error procesando la solicitud" });
  }
});*/

// Endpoint TTS
router.post("/tts", async (req, res) => {
  const { text, voiceId } = req.body;
  if (!text) return res.status(400).json({ error: "El campo 'text' es obligatorio" });

  try {
    const audioStream = await elevenlabs.textToSpeech.convert(
      voiceId || "JBFqnCBsd6RMkjVDRZzb",
      {
        text,
        modelId: "eleven_multilingual_v2",
        outputFormat: "mp3_44100_128",
      }
    );

    // Convertimos el stream a buffer
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
    });
    res.send(audioBuffer);
  } catch (error) {
    console.error("Error en TTS:", error);
    res.status(500).json({ error: "Error generando audio" });
  }
});


// Endpoint STT
router.post("/", upload.single("audio"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Se requiere archivo de audio" });

  try {
    const userText = await speechToText(req.file.path);
    res.json({ text: userText });
  } catch (error) {
    console.error("Error en STT:", error);
    res.status(500).json({ error: "Error transcribiendo audio" });
  }
});



module.exports = router;
