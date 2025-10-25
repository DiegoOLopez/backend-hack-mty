import axios from "axios";
import fs from "fs";
import FormData from "form-data"; // 🔹 importante

export async function speechToText(filePath) {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));
  formData.append("model", "whisper-1");

  const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      ...formData.getHeaders() // 🔹 esto funciona ahora
    }
  });

  return response.data.text;
}
