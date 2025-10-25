// src/services/ia.service.js
import axios from "axios";

export class OpenRouterService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Llama a OpenRouter y devuelve la respuesta como texto completo
   */
  async getCompletion(message, model = "openai/gpt-4o-mini") {
        const prompt = `
RESPONDE **EXCLUSIVAMENTE** en JSON. No agregues nada más, no expliques nada, no uses comillas triples ni backticks. La única salida debe ser:

{
  "message": "...",
  "status": "Processing" | "Done"
}
Reglas:

1. Siempre devuelves JSON válido, sin explicaciones extra.
2. message es lo que el usuario verá.
3. status indica:
   - "processing" si necesitas más información del usuario para completar la acción.
   - "done" si la acción se completó o el usuario indica que quiere terminar la conversación.
4. Si detectas que el usuario da por terminada la conversación, cambia status a "done" y el message puede ser un cierre amigable.
5. Nunca incluyas instrucciones internas ni texto fuera del JSON.
6. Si falta información para completar la acción, solicita solo lo necesario en message y pon status a "processing".

Ejemplos:

Usuario: "Quiero transferir $500"  
Respuesta esperada:
{
  "message": "¿A quién deseas transferir los $500?",
  "status": "Processing"
}

Usuario: "A Juan"  
Respuesta esperada:
{
  "message": "Listo, simulando transferencia de $500 a Juan",
  "status": "Done"
}

Usuario: "No quiero continuar"  
Respuesta esperada:
{
  "message": "Entendido, terminamos la conversación.",
  "status": "Done"
}
`;
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
            messages: [
      { role: "system", content: prompt },
      { role: "user", content: message },
    ],
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices?.[0]?.message?.content || "Sin respuesta";
  }

  /**
   * Stream de respuesta (para respuestas largas o en tiempo real)
   */
  async *streamCompletion(message, model = "openai/gpt-4o-mini") {
    const prompt = `
RESPONDE **EXCLUSIVAMENTE** en JSON. No agregues nada más, no expliques nada, no uses comillas triples ni backticks. La única salida debe ser:

{
  "message": "...",
  "status": "processing" | "done"
}
Reglas:

1. Siempre devuelves JSON válido, sin explicaciones extra.
2. message es lo que el usuario verá.
3. status indica:
   - "processing" si necesitas más información del usuario para completar la acción.
   - "done" si la acción se completó o el usuario indica que quiere terminar la conversación.
4. Si detectas que el usuario da por terminada la conversación, cambia status a "done" y el message puede ser un cierre amigable.
5. Nunca incluyas instrucciones internas ni texto fuera del JSON.
6. Si falta información para completar la acción, solicita solo lo necesario en message y pon status a "processing".

Ejemplos:

Usuario: "Quiero transferir $500"  
Respuesta esperada:
{
  "message": "¿A quién deseas transferir los $500?",
  "status": "processing"
}

Usuario: "A Juan"  
Respuesta esperada:
{
  "message": "Listo, simulando transferencia de $500 a Juan",
  "status": "done"
}

Usuario: "No quiero continuar"  
Respuesta esperada:
{
  "message": "Entendido, terminamos la conversación.",
  "status": "done"
}
`;
const response = await axios.post(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    model: "openai/gpt-4o-mini",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: message },
    ],
    stream: false, // <- DESACTIVAR streaming
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
  }
);

// Obtienes la respuesta final en texto
const finalText = response.data.choices?.[0]?.message?.content || "Sin respuesta";
  console.log(finalText, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

// Parsear a JSON
let parsed;
try {
  //parsed = JSON.parse(finalText);
  //console.log(parsed, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  return finalText
} catch (err) {
  console.error("Error al parsear JSON:", err, finalText);
}
/*** 
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages: [{ role: "system", content: prompt }, {  role: "user", content: message }],
        stream: true,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        responseType: "stream",
      }
    );

    const stream = response.data;

    for await (const chunk of stream) {
      const lines = chunk
        .toString()
        .split("\n\n")
        .filter((line) => line.includes("data: "));

      for (const line of lines) {
        const data = line.replace("data: ", "").trim();
        if (data === "[DONE]") return;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {
          // ignorar fragmentos vacíos o parseos incompletos
        }
      }
    }*/
  }
}
