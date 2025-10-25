import axios from "axios";
import fs from "fs";

export async function textToSpeech(text, outputFile) {
  const response = await axios.post(
    "https://api.elevenlabs.io/v1/text-to-speech/94zOad0g7T7K4oa7zhDq", // reemplaza YOUR_VOICE_ID
    { text },
    {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
      },
      responseType: "arraybuffer"
    }
  );

  fs.writeFileSync(outputFile, response.data);
  return outputFile;
}
