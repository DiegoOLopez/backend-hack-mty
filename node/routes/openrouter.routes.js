const express = require('express');
const {validacionJWT, verificarRol }= require('./validacionJWT');


const router = express.Router();
const axios = require('axios');

const { models } = require('./../libs/sequelize');

const { OpenRouterService } = require('./../services/openrouter.service')

const service = new OpenRouterService(process.env.OPENROUTER_API_KEY);


// endpoint para IA de OpenRouter
router.get("/", async (req, res) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o",
        messages: [
          { role: "user", content: "qb chotaa sos" }
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


router.post("/",validacionJWT, async (req, res) => {
  const { message } = req.body;
  console.log(req.user, "asiodpjfaosidjfasdoifjaoifaosidjf")
  // Obtenemos la ultima conversacio
const last_conversacion = await models.Conversacion.findOne({
  where: { usuario_id: req.user.sub },
  order: [['id', 'DESC']]
});
console.log(last_conversacion)
  let id_conversacion;
  if (!last_conversacion || last_conversacion.status == 'Done'){
      const response = await models.Conversacion.create({
        usuario_id: req.user.sub,
        nombre: "conversacion",
        fecha_creacion: Date.now(),
        status: "Process"
      });

      id_conversacion = response.id
  } else {
    id_conversacion = last_conversacion.id
  }
  console.log(id_conversacion, "asdokfasdpofkaspdokfpaosdkfopas")
  // Guardamos el mensaje del usuario
  await models.Mensaje.create({
    remitente: 'Usuario',
    contenido: message,
    fecha_envio: Date.now(),
    conversacion_id: id_conversacion
  })

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    let botResponse = ""; // acumulador de todo lo que envía el bot
    for await (const chunk of service.streamCompletion(message)) {
      botResponse += chunk; // acumulamos el texto parcial
      res.write(`data: ${chunk}\n\n`);
    }
      await models.Mensaje.create({
    remitente: 'model',
    contenido: botResponse,
    fecha_envio: Date.now(),
    conversacion_id: id_conversacion
  });
    res.write("event: done\ndata: [DONE]\n\n");
  } catch (err) {
    console.error("Error:", err.message);
    res.write(`data: Error: ${err.message}\n\n`);
  } finally {
    res.end();
  }
});

// ✅ Endpoint combinado: voz -> texto -> OpenRouter -> voz
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });

const { speechToText } = require("../services/elevenlabs.service.js");
const { getResponse } = require("../services/openrouter.service.js");
const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

router.post("/voice-chat", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Se requiere archivo de audio" });
  }

  try {
    // Transcribir voz a texto (STT)
    const userText = await speechToText(req.file.path);
    console.log("Usuario dijo:", userText);

    // Obtener respuesta de OpenRouter
    const botResponse = await service.getCompletion(userText);
    console.log("OpenRouter respondió:", botResponse);

    // Convertir respuesta de texto a voz (TTS)
    const audioStream = await elevenlabs.textToSpeech.convert(
      "JBFqnCBsd6RMkjVDRZzb", // ID de voz — puedes cambiarlo por otra
      {
        text: botResponse,
        modelId: "eleven_multilingual_v2",
        outputFormat: "mp3_44100_128",
      }
    );

    // Convertir stream a buffer
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    // Enviar respuesta como archivo de audio
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
    });
    res.send(audioBuffer);
  } catch (error) {
    console.error("Error en /voice-chat:", error);
    res.status(500).json({ error: "Error procesando la conversación" });
  } finally {
    //  Eliminar archivo temporal
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.warn("No se pudo eliminar archivo temporal:", e.message);
    }
  }
});




module.exports = router;