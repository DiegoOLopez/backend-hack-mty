const { ChatOpenAI } = require('langchain/chat_models/openai')
const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { transferTool, paymentTool, balanceTool } = require('./agent_tools')

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENROUTER_API_KEY,
});

const executor = await initializeAgentExecutorWithOptions(
  [transferTool, paymentTool, balanceTool],
  model,
  {
    agentType: "chat-conversational-react-description",
    verbose: true,
  }
);

export async function handleUserMessage(message) {
  let done = false;
  let contextMessage = message;
  let output;

  while (!done) {
    try {
      output = await executor.call({ input: contextMessage });
      done = true;
    } catch (err) {
      const error = err.message;
      // Detecta si faltan parámetros
      try {
        const missingInfo = JSON.parse(error).missing;
        // Pregunta al usuario por los parámetros faltantes
        // En hackathon puedes simular con prompt directo
        contextMessage = `El usuario no indicó ${missingInfo.join(
          ", "
        )}. Pregunta al usuario y completa:`;
      } catch {
        throw err;
      }
    }
  }

  return output.output;
}
