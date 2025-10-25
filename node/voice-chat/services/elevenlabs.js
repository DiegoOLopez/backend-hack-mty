// services/elevenlabs.js
import axios from "axios";
import fs from "fs";
import path from "path";

const ELEVEN_API = "https://api.elevenlabs.io/v1";

/**
 * Convierte voz (audio) a texto.
 * @param {Buffer} audioBuffer - Audio del usuario en formato mp3/wav.
 * @returns {Promise<string>} Texto transcrito.
 */
export async function speechToText(audioBuffer) {
  try {
    const response = await axios.post(
      `${ELEVEN_API}/speech-to-text`,
      audioBuffer,
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "audio/mpeg",
        },
      }
    );

    return response.data.text;
  } catch (error) {
    console.error("Error en speechToText:", error.response?.data || error);
    throw new Error("No se pudo transcribir el audio.");
  }
}

/**
 * Convierte texto a voz (genera un archivo MP3).
 * @param {string} text - Texto que se convertirá a voz.
 * @returns {Promise<string>} Ruta del archivo de audio generado.
 */
export async function textToSpeech(text) {
  try {
    const response = await axios.post(
      `${ELEVEN_API}/text-to-speech/${process.env.VOICE_ID}/stream`,
      {
        text,
        model_id: "eleven_multilingual_v2",
      },
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    const outputPath = path.resolve("response.mp3");
    fs.writeFileSync(outputPath, response.data);
    return outputPath;
  } catch (error) {
    console.error("Error en textToSpeech:", error.response?.data || error);
    throw new Error("No se pudo generar el audio.");
  }
}
