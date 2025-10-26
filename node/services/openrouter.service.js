// src/services/ia.service.js
import axios from "axios";

export class OpenRouterService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Llama a OpenRouter y devuelve la respuesta como texto completo
   */
  async getCompletion(message, context, json_conversation, contactos_usuario, cuentas_propias, model = "openai/gpt-4o-mini") {

  const data_action = {
  "accion": "transferencia | alta_contacto | contratar_producto",
  "accion": "listo | procesando | cancelado",
  "tipo_producto": "tarjeta_credito | cuenta_corriente | cuenta_ahorro | prestamo_auto",
  "detalle": {
    "monto": 0,                 // Solo para transferencias
    "moneda": "USD",            // Opcional, default USD
    "destinatario": "",         // Nombre del contacto o cuenta
    "contacto_id": null,        // ID interno del contacto si ya existe
    "producto_nombre": "",       // Nombre del producto (ej: Quicksilver Rewards)
    "usuario_id": null           // ID del usuario que solicita la acción
  },
  "status": "processing | done", // processing si falta info, done si la acción se completó
  "mensaje_usuario": ""          // Mensaje que verá el usuario
}



        
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
            messages: context,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 15000
      }
    );


    try {
      json_conversation = JSON.parse(response.data.choices?.[0]?.message?.content || "{}");
    } catch (error) {
      console.error("❌ Error al parsear JSON:", error.message);
    }

    return  json_conversation;
  }

  /**
   * Stream de respuesta (para respuestas largas o en tiempo real)
   */
  async *streamCompletion(message, model = "openai/gpt-4o-mini") {
    const prompt = `
RESPONDE EXCLUSIVAMENTE en JSON. No agregues nada más. La salida debe ser:

{
  "message": "...",
  "status": "processing" | "done"
}

Reglas:
1. message es lo que el usuario vera.
2. status indica:
   - "processing" si necesitas mas informacion.
   - "done" si la accion se completo o el usuario termina.
3. Si falta informacion, pide solo lo necesario en message y pon status: "processing".
4. Nunca incluyas instrucciones internas ni texto fuera del JSON.

Informacion de CAPITAL ONE para que no inventes nada:
Tarjetas de credito: ${tarjetasCredito}
Cuentas corrientes: ${cuentasCorrientes} 
Cuentas de ahorro: ${cuentasAhorro}
Prestamo de autos: ${prestamosAuto}
Si el cliente trata de contratar un producto, trata de llevarlo a la contratacion lo mas rapido posible, tienes maximo 3 mensajes de respuesta para realizar la contratacion

Informacion del cliente:
Contactos que tiene guardados disponibles para transferir: 
${contactos_usuario}
Cuentas propias que tiene el usuario (Tambien puede transferirse entre el)
${cuentas_propias}


Requisitos para cada accion:
alta_contacto: Solo se necesita nombre_alta_contacto y numero_de_cuenta, una vez proporcionados se realiza la alta
transferencia: Necesitamos el nombre_cuenta_saliente, nombre_contacto_destino y monto una vez proporcionados, se dicen los datos como monto, destinatario, si el cliente acepta, se hace la transferencia de decision a listo

Ejemplos:

Usuario: "Quiero transferir $500"  
Respuesta esperada:
{
  "message": "A quién deseas transferir los $500",
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
No incluyas caracteres especiales que puedan romper el JSON, no estan permitidos caracteres especiales entre las comillas
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
