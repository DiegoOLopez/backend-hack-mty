import dotenv from "dotenv";
dotenv.config(); // 🔹 cargar variables de entorno primero

import express from "express";
import multer from "multer";
import { speechToText } from "./services/whisper.js";
import { generateResponse } from "./services/openrouter.js";
import { textToSpeech } from "./services/elevenlabs.js";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/voice", upload.single("audio"), async (req, res) => {
  try {
    const audioPath = req.file.path;

    // 1️⃣ Audio a texto
    const userText = await speechToText(audioPath);

    // 2️⃣ Texto a respuesta
    const botResponse = await generateResponse(userText);

    // 3️⃣ Respuesta a audio
    const audioFile = `output_${Date.now()}.mp3`;
    await textToSpeech(botResponse, audioFile);

    // 4️⃣ Enviar audio al cliente
    res.setHeader("Content-Type", "audio/mpeg");
    fs.createReadStream(audioFile).pipe(res);

    // Limpiar archivos temporales
    fs.unlinkSync(audioPath);
    fs.unlinkSync(audioFile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error procesando el audio");
  }
});

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
