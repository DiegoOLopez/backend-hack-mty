import dotenv from "dotenv";
dotenv.config();

import { handleUserMessage } from "./agent.js"; // Tu servicio con LangChain + dispatcher

// Función para probar el agente
async function main() {
  const message = process.argv.slice(2).join(" "); // Lee lo que pases en la terminal
  if (!message) {
    console.log("Escribe un mensaje para enviar al AI Agent");
    return;
  }

  try {
    const response = await handleUserMessage(message);
    console.log("🤖 AI Agent dice:", response);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
