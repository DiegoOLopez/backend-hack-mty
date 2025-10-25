// src/services/ia.service.js
import axios from "axios";

export class OpenRouterService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  // 🔹 Llamada normal (respuesta completa)
  async getCompletion(message, model = "openai/gpt-4o-mini") {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages: [{ role: "user", content: message }],
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

  // 🔹 Versión streaming que devuelve un AsyncGenerator
  async *streamCompletion(message, model = "openai/gpt-4o-mini") {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages: [{ role: "user", content: message }],
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
    }
  }
}
