// src/services/ia.service.js
import axios from "axios";

export class OpenRouterService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Llama a OpenRouter y devuelve la respuesta como texto completo
   */
  async getCompletion(message, context, model = "openai/gpt-4o-mini") {

    
  const tarjetasCredito = {
    "Venture X Rewards": {
      "descripcion": "Tarjeta premium de recompensas de viaje con 10X millas en hoteles y alquileres de autos reservados a través de Capital One Travel.",
      "beneficios": ["75,000 millas de bonificación", "Acceso a salas VIP de aeropuertos", "Sin cuota por transacciones extranjeras"],
      "cuotaAnual": "$395",
      "puntuacionCreditoMinima": 750
    },
    "Venture Rewards": {
      "descripcion": "Tarjeta de recompensas de viaje con 2 millas por cada dólar gastado.",
      "beneficios": ["75,000 millas de bonificación", "5 millas por cada dólar en viajes reservados a través de Capital One Travel"],
      "cuotaAnual": "$95",
      "puntuacionCreditoMinima": 700
    },
    "VentureOne Rewards": {
      "descripcion": "Tarjeta de recompensas de viaje sin cuota anual.",
      "beneficios": ["20,000 millas de bonificación", "5 millas por cada dólar en viajes reservados a través de Capital One Travel"],
      "cuotaAnual": "$0",
      "puntuacionCreditoMinima": 700
    },
    "Quicksilver Rewards": {
      "descripcion": "Tarjeta de reembolso en efectivo con 1.5% en todas las compras.",
      "beneficios": ["$200 de bonificación en efectivo", "Sin cuota anual"],
      "cuotaAnual": "$0",
      "puntuacionCreditoMinima": 700
    },
    "Savor Rewards": {
      "descripcion": "Tarjeta de recompensas para cenas y entretenimiento.",
      "beneficios": ["$200 de bonificación en efectivo", "4% en cenas y entretenimiento", "Sin cuota anual"],
      "cuotaAnual": "$0",
      "puntuacionCreditoMinima": 700
    },
    "Platinum Credit Card": {
      "descripcion": "Tarjeta para la construcción de crédito con APR bajo.",
      "beneficios": ["APR bajo", "Sin cuota anual"],
      "cuotaAnual": "$0",
      "puntuacionCreditoMinima": 580
    },
    "QuicksilverOne Rewards": {
      "descripcion": "Tarjeta de reembolso en efectivo para crédito justo.",
      "beneficios": ["1.5% en todas las compras", "Sin cuota anual"],
      "cuotaAnual": "$39",
      "puntuacionCreditoMinima": 600
    }
  }

  const cuentasCorrientes = {
    "360 Checking": {
      "descripcion": "Cuenta corriente sin comisiones mensuales ni saldo mínimo.",
      "beneficios": ["Acceso a más de 70,000 cajeros automáticos sin comisiones", "Aplicación móvil de alta calificación", "Sin cuota mensual"],
      "cuotaMensual": "$0"
    },
    "MONEY Teen Checking": {
      "descripcion": "Cuenta corriente para adolescentes con supervisión parental.",
      "beneficios": ["Sin cuota mensual", "Aplicación móvil para padres e hijos", "Sin saldo mínimo"],
      "cuotaMensual": "$0"
    }
  }

  const cuentasAhorro = {
    "360 Performance Savings": {
      "descripcion": "Cuenta de ahorros con una tasa de interés competitiva.",
      "beneficios": ["Sin cuota mensual", "Sin saldo mínimo", "Interés compuesto diario"],
      "cuotaMensual": "$0",
      "tasaInteres": "3.40% APY"
    },
    "360 Kids Savings": {
      "descripcion": "Cuenta de ahorros para niños con supervisión parental.",
      "beneficios": ["Sin cuota mensual", "Sin saldo mínimo", "Interés compuesto diario"],
      "cuotaMensual": "$0",
      "tasaInteres": "3.40% APY"
    },
    "360 CDs": {
      "descripcion": "Certificados de depósito con tasas fijas y plazos flexibles.",
      "beneficios": ["Tasas de interés fijas", "Plazos desde 6 hasta 60 meses", "Sin cuota mensual"],
      "cuotaMensual": "$0"
    }
  }

  const prestamosAuto = {
    "Auto Navigator": {
      "descripcion": "Herramienta para encontrar, financiar y comprar un automóvil nuevo o usado.",
      "beneficios": ["Precalificación sin afectar tu puntaje crediticio", "Opciones de financiamiento flexibles", "Proceso en línea conveniente"],
      "cuotaMensual": "Variable según el monto financiado y el término del préstamo"
  }
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
      }
    );

    return response.data.choices?.[0]?.message?.content || "Sin respuesta";
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
