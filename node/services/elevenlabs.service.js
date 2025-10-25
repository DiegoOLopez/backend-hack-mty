
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

// ---- Texto a voz ----
export async function textToSpeech(text, voiceId = "JBFqnCBsd6RMkjVDRZzb", outputFile = "response.mp3") {
  const audioBuffer = await elevenlabs.textToSpeech.convert(voiceId, {
    text,
    modelId: "eleven_multilingual_v2",
    outputFormat: "mp3_44100_128"
  });

  fs.writeFileSync(outputFile, Buffer.from(await audioBuffer.arrayBuffer()));
  return outputFile;
}

// ---- Voz a texto ----
export async function speechToText(filePath, modelId = "scribe_v1") {
  const audioBuffer = fs.readFileSync(filePath);
  const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });

  const transcription = await elevenlabs.speechToText.convert({
    file: audioBlob,
    modelId,
    tagAudioEvents: true,
    languageCode: "eng",
    diarize: true
  });

  return transcription.text;
}
