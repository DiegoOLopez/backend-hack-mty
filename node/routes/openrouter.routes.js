const express = require('express');
const {validacionJWT, verificarRol }= require('./validacionJWT');


const router = express.Router();
const axios = require('axios');

const { models } = require('./../libs/sequelize');

const { OpenRouterService } = require('./../services/openrouter.service')

const service = new OpenRouterService(process.env.OPENROUTER_API_KEY);


// endpoint para IA de OpenRouter
router.get("/", async (req, res) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o",
        messages: [
          { role: "user", content: "qb chotaa sos" }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extraemos la respuesta del asistente
    const botMessage = response.data.choices?.[0]?.message?.content || "No hay respuesta";

    res.json({ botMessage, raw: response.data });
  } catch (err) {
    console.error("Error probando OpenRouter:", err.response?.data || err.message);
    res.status(500).json({ error: "Error en OpenRouter", details: err.response?.data || err.message });
  }
});


router.post("/",validacionJWT, async (req, res) => {
  const { message } = req.body;
  // Obtenemos la ultima conversacio
const last_conversacion = await models.Conversacion.findOne({
  where: { usuario_id: req.user.sub },
  order: [['id', 'DESC']]
});
  let id_conversacion;
  let json_conversation;
  if (!last_conversacion || last_conversacion.status == 'done'){
      const response = await models.Conversacion.create({
        usuario_id: req.user.sub,
        nombre: "conversacion",
        fecha_creacion: Date.now(),
        status: "process",
        data: {status: "process"}
      });
      id_conversacion = response.id
      json_conversation = response.data
  } else {
    id_conversacion = last_conversacion.id
    json_conversation = last_conversacion.data
  }




const prompt = `
RESPONDE **EXCLUSIVAMENTE** en JSON. No agregues nada más, no expliques nada, no uses comillas triples ni backticks. La única salida debe ser:

Deberas rellenar en base a todo lo que haya dicho el cliente, cuando tengas los datos listos podras autirizar cambiando a decision listo, si el usuario llegar a terminar la conversacion, lo cambias a cancelado, y si aun no terminas lo cambias a procesando para pedir la informacion restante
{
  "accion": "transferencia | alta_contacto | contratar_producto",
  "decision": "listo | procesando | cancelado",
  "tipo_producto": "tarjeta_credito | cuenta_corriente | cuenta_ahorro | prestamo_auto",
  "detalle": {
    "numero_de_cuenta_saliente": 0 // Es el numero de cuenta del que se mandara el dinero de la transferencia
    "numero_de_cuenta_destino": 0 // Es el numero de cuenta que recibira el dinero
    "nombre_cuenta_saliente": "" // Es el nombre de la cuenta que saldra el dinero del cliente
    "nombre_contacto_destino": "" // Es a quien se le mandara el dinero en caso de ser contacto 
    "monto": 0,                 // Solo para transferencias
    "moneda": "USD",            // Opcional, default USD
    "numero_de_cuenta": "",         // Numero de cuenta exclusivo
    "nombre_del_destinatario": "", // Numero de persona a transferir exclusivo
    "nombre_alta_contacto": "", // Nombre exclusivo para la persona que se da de alta como contacto
    "contacto_id": null,        // ID interno del contacto si ya existe
    "producto_nombre": "",       // Nombre del producto (ej: Quicksilver Rewards)
    "usuario_id": null           // ID del usuario que solicita la acción
  },
  "status": "processing | done", // processing si falta info, done si la acción se completó
  "mensaje_usuario": ""          // Mensaje que verá el usuario
}

Tienes acceso al registro si no es null
${json_conversation}
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
  console.log("Se setea el contexto")
  // Guardamos el mensaje del usuario
  await models.Mensaje.create({
    remitente: 'user',
    contenido: prompt + message,
    fecha_envio: Date.now(),
    conversacion_id: id_conversacion
  })
    const mensajes = await models.Mensaje.findAll({
  where: { conversacion_id: id_conversacion },
  order: [['fecha_envio', 'ASC']] // orden cronológico
  });

  console.log("Se cargan los mensajes ")
  const context = mensajes.map(msg => ({
  role: msg.remitente === 'user' ? 'user' : 'assistant',
  content: msg.contenido
  }));

  console.log("Se carga el contexto")

    context.unshift({
    role: 'system',
    content: 'Eres un Agente de banca conversacional que entiende productos financieros válidos de Capital One, puede guiar al usuario para adquirir productos, hacer transferencias, validar cuentas y saldo, y generar confirmacionesAgente de banca conversacional que entiende productos financieros válidos de Capital One, puede guiar al usuario para adquirir productos, hacer transferencias, validar cuentas y saldo, y generar confirmaciones, mientras que el backend maneja la información real y la seguridad'
  });
  console.log("Se crea el contexto")
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
/** 
  try {
    let botResponse = ""; // acumulador de todo lo que envía el bot
    for await (const chunk of service.streamCompletion(message)) {
      botResponse += chunk; // acumulamos el texto parcial
      res.write(`data: ${chunk}\n\n`);
    }
      await models.Mensaje.create({
    remitente: 'model',
    contenido: botResponse,
    fecha_envio: Date.now(),
    conversacion_id: id_conversacion
  });
    res.write("event: done\ndata: [DONE]\n\n");
  }*/
 try {
  // Llamada normal que devuelve la respuesta completa
  const botResponse = await service.getCompletion(message, context, json_conversation); // ya no streamCompletion
  console.log(botResponse, "bot responseee")
  // Guardamos la respuesta en la base de datos
  await models.Mensaje.create({
    remitente: 'assistant',
    contenido: botResponse.mensaje_usuario,
    fecha_envio: Date.now(),
    conversacion_id: id_conversacion
  });
  if (botResponse.status === "done") {
    const conversacion = await models.Conversacion.findByPk(id_conversacion);
    
    if (conversacion) {
      await conversacion.update({
        status: botResponse.status,
        data: botResponse
      });
    }
    if (botResponse.decision === "listo"){
      console.log("Listo")
      console.log(botResponse.accion)
      if (botResponse.accion === "alta_contacto"){
        const cuentas = (await axios.get("http://api.nessieisreal.com/accounts?key=b9c71161ea6125345750dcb92f0df27c")).data;
        for (let i = 0; i < cuentas.length; i++){
          console.log(cuentas[i], "====", botResponse.detalle.numero_de_cuenta)
          if (cuentas[i].account_number == botResponse.detalle.numero_de_cuenta){
            models.Contacto.create({
              nombre: botResponse.detalle.nombre_alta_contacto,
              numero_cuenta: botResponse.detalle.numero_de_cuenta,
              cuenta_id: cuentas[i]._id,
              fecha_creacion: Date.now()
            })
          }
        }
      }
    } else {
      console.log("Cancelado")
    }
  }




  // Enviamos la respuesta al cliente
  res.write(botResponse.mensaje_usuario);
  res.end();
} catch (err) {
    console.error("Error:", err.message);
    res.write(`data: Error: ${err.message}\n\n`);
  } finally {
    res.end();
  }
});




// Endpoint combinado: voz -> texto -> OpenRouter -> voz
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });

const { speechToText } = require("../services/elevenlabs.service.js");
const { getResponse } = require("../services/openrouter.service.js");
const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");
const { conversations } = require('@elevenlabs/elevenlabs-js/api/resources/conversationalAi/index.js');
const { update } = require('../controller/cliente.controller.js');

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

router.post("/voice-chat", upload.single("audio"), validacionJWT, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Se requiere archivo de audio" });
  }

  try {
    // 1️⃣ Transcribir voz a texto (STT)
    const userText = await speechToText(req.file.path);
    console.log("Usuario dijo:", userText);

    // 2️⃣ Obtener última conversación del usuario
    const last_conversacion = await models.Conversacion.findOne({
      where: { usuario_id: req.user.sub },
      order: [['id', 'DESC']]
    });

    let id_conversacion;
    if (!last_conversacion || last_conversacion.status === 'Done') {
      const response = await models.Conversacion.create({
        usuario_id: req.user.sub,
        nombre: "conversacion",
        fecha_creacion: Date.now(),
        status: "Process"
      });
      id_conversacion = response.id;
    } else {
      id_conversacion = last_conversacion.id;
    }

    // 3️⃣ Guardar mensaje del usuario en DB
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
   - "processing" si necesitas más información del usuario.
   - "done" si la acción se completó o el usuario da por terminada la conversación.
`;
    await models.Mensaje.create({
      remitente: 'user',
      contenido: prompt + userText,
      fecha_envio: Date.now(),
      conversacion_id: id_conversacion
    });

    // 4️⃣ Construir contexto de conversación
    const mensajes = await models.Mensaje.findAll({
      where: { conversacion_id: id_conversacion },
      order: [['fecha_envio', 'ASC']]
    });

    const context = mensajes.map(msg => ({
      role: msg.remitente === 'user' ? 'user' : 'assistant',
      content: msg.contenido
    }));

    context.unshift({
      role: 'system',
      content: 'Eres un Agente de banca conversacional que entiende productos financieros válidos de Capital One, puede guiar al usuario para adquirir productos, hacer transferencias, validar cuentas y saldo, y generar confirmaciones. El backend maneja la información real y la seguridad.'
    });

    // 5️⃣ Obtener respuesta de OpenRouter
    const botResponse = await service.getCompletion(userText, context);
    const responseJSON = JSON.parse(botResponse);

    // Guardar mensaje del bot en DB
    await models.Mensaje.create({
      remitente: 'assistant',
      contenido: responseJSON.message,
      fecha_envio: Date.now(),
      conversacion_id: id_conversacion
    });

    // Actualizar estado de conversación si terminó
    if (responseJSON.status === "Done") {
      const conversacion = await models.Conversacion.findByPk(id_conversacion);
      if (conversacion) {
        await conversacion.update({ status: responseJSON.status });
      }
    }

    // 6️⃣ Convertir respuesta a voz (TTS)
    const audioStream = await elevenlabs.textToSpeech.convert(
      "V6rHKMlMDJPdxDisHSfZ",
      {
        text: responseJSON.message,
        modelId: "eleven_multilingual_v2",
        outputFormat: "mp3_44100_128",
      }
    );

    const chunks = [];
    for await (const chunk of audioStream) chunks.push(chunk);
    const audioBuffer = Buffer.concat(chunks);

    // 7️⃣ Enviar audio como respuesta
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
    });
    res.send(audioBuffer);

  } catch (error) {
    console.error("Error en /voice-chat:", error);
    res.status(500).json({ error: "Error procesando la conversación" });
  } finally {
    // Eliminar archivo temporal
    try { fs.unlinkSync(req.file.path); } 
    catch (e) { console.warn("No se pudo eliminar archivo temporal:", e.message); }
  }
});





module.exports = router;