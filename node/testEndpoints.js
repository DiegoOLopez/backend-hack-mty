import fs from "fs";
import FormData from "form-data";
import axios from "axios";

// Cambia esto a tu archivo de audio de prueba
const audioFilePath = "./prueba.mp3";

// --- Función STT ---
async function speechToText() {
  const formData = new FormData();
  formData.append("audio", fs.createReadStream(audioFilePath));

  try {
    const response = await axios.post("http://localhost:3000/stt", formData, {
      headers: formData.getHeaders(),
    });
    console.log("Texto transcrito:", response.data.text);
    return response.data.text;
  } catch (err) {
    console.error("Error STT:", err.response?.data || err.message);
    return null;
  }
}

// --- Función TTS ---
async function textToSpeech(text) {
  try {
    const response = await axios.post(
      "http://localhost:3000/tts",
      { text },
      { responseType: "arraybuffer" } // Muy importante para audio
    );
    fs.writeFileSync("output.mp3", response.data);
    console.log("Audio TTS guardado en output.mp3");
  } catch (err) {
    console.error("Error TTS:", err.response?.data || err.message);
  }
}

// --- Script principal ---
(async () => {
  const text = await speechToText();
  if (text) {
    await textToSpeech(text);
  }
})();
