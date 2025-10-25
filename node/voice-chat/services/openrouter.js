// services/openrouter.js
import axios from "axios";

/**
 * Envía texto al modelo de IA en OpenRouter y devuelve la respuesta generada.
 * @param {string} prompt - Texto del usuario.
 * @returns {Promise<string>} Respuesta generada por la IA.
 */
export async function askAI(prompt) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini", // Puedes cambiarlo por otro modelo de OpenRouter
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error en askAI:", error.response?.data || error);
    throw new Error("No se pudo obtener respuesta de la IA.");
  }
}
