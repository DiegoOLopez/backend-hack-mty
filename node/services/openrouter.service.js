import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function getResponse(prompt) {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/completions",
    {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0].message.content;
}
