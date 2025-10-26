const express = require('express');
const {validacionJWT, verificarRol }= require('./validacionJWT');


const router = express.Router();
const axios = require('axios');

const { models } = require('./../libs/sequelize');

const { OpenRouterService } = require('./../services/openrouter.service')

const TransferService = require('../services/transfer.service');

const service = new OpenRouterService(process.env.OPENROUTER_API_KEY);

const transfer_service = new TransferService()

const ClienteService = require('../services/cliente.service');

const cliente_service = new ClienteService();


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


// Registros de usuario

//const cuentas_propias = (await axios.get(`http://api.nessieisreal.com/customers/${req.user.id_cliente}/accounts?key=b9c71161ea6125345750dcb92f0df27c`)).data;
const cuentas_propias = (await axios.get(`http:/mockdb-production.up.railway.app/customers/68fc4df19683f20dd51a3f39/accounts`)).data;
console.log("Cuentas propias", cuentas_propias)
const contactos_usuario = await models.Contacto.findAll()

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



const prompt = `
RESPONDE **EXCLUSIVAMENTE** en JSON. No agregues nada más, no expliques nada, no uses comillas triples ni backticks. La única salida debe ser:

Deberas rellenar en base a todo lo que haya dicho el cliente, cuando tengas los datos listos podras autirizar cambiando a decision listo, si el usuario llegar a terminar la conversacion, lo cambias a cancelado, y si aun no terminas lo cambias a procesando para pedir la informacion restante
{
  "accion": "transferencia | alta_contacto | contratar_producto",
  "decision": "listo | procesando | cancelado",
  "tipo_producto": "tarjeta_credito | cuenta_corriente | cuenta_ahorro | prestamo_auto",
  "detalle": {
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
    "tipo_de_producto_a_contratar": "" // Aqui solo tiene 3 estados ['Credit Card', 'Savings', 'Checking']
    "nombre_del_producto": "" // Se usara nombres de los productos asignados previamente en la data que te pase
  },
  "status": "processing | done", // processing si falta info, done si la acción se completó
  "mensaje_usuario": ""          // Mensaje que verá el usuario
}

Tienes acceso al registro si no es null
 ${JSON.stringify(json_conversation, null, 2)}

Informacion de CAPITAL ONE para que no inventes nada:
Tarjetas de credito: ${JSON.stringify(tarjetasCredito, null, 2)}
Cuentas corrientes: ${JSON.stringify(cuentasCorrientes, null, 2)}
Cuentas de ahorro: ${JSON.stringify(cuentasAhorro, null, 2)}
Prestamo de autos: ${JSON.stringify(prestamosAuto, null, 2)}
Si el cliente trata de contratar un producto, trata de llevarlo a la contratacion lo mas rapido posible, tienes maximo 3 mensajes de respuesta para realizar la contratacion

Informacion del cliente:
Contactos que tiene guardados disponibles para transferir: 
${JSON.stringify(contactos_usuario, null, 2)}
Cuentas propias que tiene el usuario (Tambien puede transferirse entre el)
${JSON.stringify(cuentas_propias, null, 2)}

Requisitos para cada accion:
alta_contacto: Solo se necesita nombre_alta_contacto y numero_de_cuenta, una vez proporcionados se realiza la alta
transferencia: Necesitamos el nombre_cuenta_saliente, nombre_contacto_destino y monto una vez proporcionados, se dicen los datos como monto, destinatario, si el cliente acepta, se hace la transferencia de decision a listo

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
  No incluyas caracteres especiales que puedan romper el JSON, no estan permitidos caracteres especiales entre las comillas

`;
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

  const context = mensajes.map(msg => ({
  role: msg.remitente === 'user' ? 'user' : 'assistant',
  content: msg.contenido
  }));


    context.unshift({
    role: 'system',
    content:  `
Eres un agente oficial de banca de **Capital One**. 
Tu única función es manejar conversaciones de clientes relacionadas con:
- Transferencias bancarias
- Altas de contactos
- Contratación de productos financieros válidos de Capital One (tarjetas, cuentas, préstamos)

❗ No puedes hablar sobre temas fuera del ámbito bancario o de Capital One.
❗ No puedes inventar productos, políticas, cuentas o nombres de personas.
❗ Si el usuario habla de temas no bancarios, responde con:
{
  "message": "Lo siento, solo puedo ayudarte con servicios de Capital One.",
  "status": "done"
}

Toda respuesta debe ser **JSON válido** y ajustarse exactamente a la estructura proporcionada.
`
    });
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
  const botResponse = await service.getCompletion(message, context); // ya no streamCompletion
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
      /**  Se da de alta contacto */
      if (botResponse.accion === "alta_contacto"){
        //const cuentas = (await axios.get("http://api.nessieisreal.com/accounts?key=b9c71161ea6125345750dcb92f0df27c")).data;
        const cuentas = (await axios.get("http:/mockdb-production.up.railway.app/accounts")).data
        console.log("Se impprimen cuentas en total", cuentas)
        for (let i = 0; i < cuentas.length; i++){
          if (cuentas[i].account_number == botResponse.detalle.numero_de_cuenta){
            models.Contacto.create({
              nombre: botResponse.detalle.nombre_alta_contacto,
              numero_cuenta: botResponse.detalle.numero_de_cuenta,
              cuenta_id: cuentas[i]._id,
              fecha_creacion: Date.now()
            })
          }
        }
      } else if (botResponse.accion === "transferencia"){
         //const cuentas = (await axios.get("http://api.nessieisreal.com/accounts?key=b9c71161ea6125345750dcb92f0df27c")).data;
          const cuentas = (await axios.get("http:/mockdb-production.up.railway.app/accounts")).data
         const contactos = await models.Contacto.findAll();
         for (let i = 0; i < cuentas.length; i++){
          // Encontramos la cuenta del usuario que envia
            if(cuentas[i].nickname == botResponse.detalle.nombre_cuenta_saliente){
              for (let j = 0; j < contactos.length; j++){
                if (contactos[j].nombre == botResponse.detalle.nombre_contacto_destino){
                    const payer_id = cuentas[i]._id;
                    const payee_id = contactos[j].cuenta_id
                    const amount = botResponse.detalle.monto
                    const descripcion = "Transferencia"
                    const transferencia = await transfer_service.createTransfer(payer_id, { payee_id, amount , descripcion})
                }
              }
            }
          }
        } else if (botResponse.accion === "contratar_producto"){
          // Aqui nos encargaremos de manejar el producto que se piense adquirir
          const body = {
            "type":  botResponse.detalle.tipo_de_producto_a_contratar,
            "nickname": botResponse.detalle.nombre_del_producto,
            "rewards": 0,
            "balance": 0,
          } 
          cliente_service.create(body, req.user.id_cliente);
        }
      }
    else {
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

const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });

const { speechToText } = require("../services/elevenlabs.service.js");

const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");
const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

router.post("/voice-chat", validacionJWT, upload.single("audio"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Se requiere archivo de audio" });

  try {
    // 1️⃣ Transcribir audio a texto
    const message = await speechToText(req.file.path);
    console.log("Usuario dijo:", message);

    // 2️⃣ Manejo de conversación en DB
    const last_conversacion = await models.Conversacion.findOne({
      where: { usuario_id: req.user.sub },
      order: [['id', 'DESC']]
    });

    let id_conversacion;
    let json_conversation;

    if (!last_conversacion || last_conversacion.status === 'done') {
      const response = await models.Conversacion.create({
        usuario_id: req.user.sub,
        nombre: "conversacion",
        fecha_creacion: Date.now(),
        status: "process",
        data: { status: "process" }
      });
      id_conversacion = response.id;
      json_conversation = response.data;
    } else {
      id_conversacion = last_conversacion.id;
      json_conversation = last_conversacion.data;
    }

   // Registros de usuario

//const cuentas_propias = (await axios.get(`http://api.nessieisreal.com/customers/${req.user.id_cliente}/accounts?key=b9c71161ea6125345750dcb92f0df27c`)).data;
const cuentas_propias = (await axios.get(`http:/mockdb-production.up.railway.app/customers/${req.user.id_cliente}/accounts`)).data;
console.log("Cuentas propias", cuentas_propias)
const contactos_usuario = await models.Contacto.findAll()

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



const prompt = `
  RESPONDE **EXCLUSIVAMENTE** en JSON. No agregues nada más, no expliques nada, no uses comillas triples ni backticks. La única salida debe ser:

  Deberas rellenar en base a todo lo que haya dicho el cliente, cuando tengas los datos listos podras autirizar cambiando a decision listo, si el usuario llegar a terminar la conversacion, lo cambias a cancelado, y si aun no terminas lo cambias a procesando para pedir la informacion restante
  {
    "accion": "transferencia | alta_contacto | contratar_producto",
    "decision": "listo | procesando | cancelado",
    "tipo_producto": "tarjeta_credito | cuenta_corriente | cuenta_ahorro | prestamo_auto",
    "detalle": {
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
      "tipo_de_producto_a_contratar": "" // Aqui solo tiene 3 estados ['Credit Card', 'Savings', 'Checking']
      "nombre_del_producto": "" // Se usara nombres de los productos asignados previamente en la data que te pase
    },
    "status": "processing | done", // processing si falta info, done si la acción se completó
    "mensaje_usuario": ""          // Mensaje que verá el usuario
  }

  Tienes acceso al registro si no es null
  ${JSON.stringify(json_conversation, null, 2)}

  Informacion de CAPITAL ONE para que no inventes nada:
  Tarjetas de credito: ${JSON.stringify(tarjetasCredito, null, 2)}
  Cuentas corrientes: ${JSON.stringify(cuentasCorrientes, null, 2)}
  Cuentas de ahorro: ${JSON.stringify(cuentasAhorro, null, 2)}
  Prestamo de autos: ${JSON.stringify(prestamosAuto, null, 2)}
  Si el cliente trata de contratar un producto, trata de llevarlo a la contratacion lo mas rapido posible, tienes maximo 3 mensajes de respuesta para realizar la contratacion

  Informacion del cliente:
  Contactos que tiene guardados disponibles para transferir: 
  ${JSON.stringify(contactos_usuario, null, 2)}
  Cuentas propias que tiene el usuario (Tambien puede transferirse entre el)
  ${JSON.stringify(cuentas_propias, null, 2)}

  Requisitos para cada accion:
  alta_contacto: Solo se necesita nombre_alta_contacto y numero_de_cuenta, una vez proporcionados se realiza la alta
  transferencia: Necesitamos el nombre_cuenta_saliente, nombre_contacto_destino y monto una vez proporcionados, se dicen los datos como monto, destinatario, si el cliente acepta, se hace la transferencia de decision a listo

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
    No incluyas caracteres especiales que puedan romper el JSON, no estan permitidos caracteres especiales entre las comillas
Usa **únicamente** la información de productos, cuentas y contactos que te proporcioné arriba. 
Si el usuario menciona algo que no está en esa información, responde:
{
  "message": "No tengo información sobre ese producto o servicio en Capital One.",
  "status": "done"
}
  `;

    // Guardar mensaje del usuario en DB
    await models.Mensaje.create({
      remitente: 'user',
      contenido: prompt + message,
      fecha_envio: Date.now(),
      conversacion_id: id_conversacion
    });

    // Cargar contexto
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
      content: `
Eres un agente oficial de banca de **Capital One**. 
Tu única función es manejar conversaciones de clientes relacionadas con:
- Transferencias bancarias
- Altas de contactos
- Contratación de productos financieros válidos de Capital One (tarjetas, cuentas, préstamos)

❗ No puedes hablar sobre temas fuera del ámbito bancario o de Capital One.
❗ No puedes inventar productos, políticas, cuentas o nombres de personas.
❗ Si el usuario habla de temas no bancarios, responde con:
{
  "message": "Lo siento, solo puedo ayudarte con servicios de Capital One.",
  "status": "done"
}

Toda respuesta debe ser **JSON válido** y ajustarse exactamente a la estructura proporcionada.
`
    });

    // Llamada a OpenRouter
    const botResponse = await service.getCompletion(message, context);

    // Guardar respuesta del bot
    await models.Mensaje.create({
      remitente: 'assistant',
      contenido: botResponse.mensaje_usuario,
      fecha_envio: Date.now(),
      conversacion_id: id_conversacion
    });

    // Ejecutar acciones si decision === "listo"
    if (botResponse.status === "done" && botResponse.decision === "listo") {
      if (botResponse.accion === "alta_contacto") {
        //const cuentas = (await axios.get("http://api.nessieisreal.com/accounts?key=b9c71161ea6125345750dcb92f0df27c")).data;
        const cuentas = (await axios.get("mock_db.railway.internal/accounts")).data
        for (let i = 0; i < cuentas.length; i++) {
          if (cuentas[i].account_number == botResponse.detalle.numero_de_cuenta) {
            await models.Contacto.create({
              nombre: botResponse.detalle.nombre_alta_contacto,
              numero_cuenta: botResponse.detalle.numero_de_cuenta,
              cuenta_id: cuentas[i]._id,
              fecha_creacion: Date.now()
            });
          }
        }
      } else if (botResponse.accion === "transferencia") {
        const cuentas = (await axios.get("http://api.nessieisreal.com/accounts?key=b9c71161ea6125345750dcb92f0df27c")).data;
        const contactos = await models.Contacto.findAll();
        for (let i = 0; i < cuentas.length; i++) {
          if (cuentas[i].nickname == botResponse.detalle.nombre_cuenta_saliente) {
            for (let j = 0; j < contactos.length; j++) {
              if (contactos[j].nombre == botResponse.detalle.nombre_contacto_destino) {
                const payer_id = cuentas[i]._id;
                const payee_id = contactos[j].cuenta_id;
                const amount = botResponse.detalle.monto;
                const descripcion = "Transferencia";
                await transfer_service.createTransfer(payer_id, { payee_id, amount, descripcion });
              }
            }
          }
        }
      }else if (botResponse.accion === "contratar_producto"){
          // Aqui nos encargaremos de manejar el producto que se piense adquirir
          const body = {
            "type":  botResponse.detalle.tipo_de_producto_a_contratar,
            "nickname": botResponse.detalle.nombre_del_producto,
            "rewards": 0,
            "balance": 0,
          } 
          cliente_service.create(body, req.user.id_cliente);
          console.log("Producto contratado")
        }
    }

    // 8️⃣ Convertir respuesta a voz y enviar
    const audioStream = await elevenlabs.textToSpeech.convert(
      "V6rHKMlMDJPdxDisHSfZ",
      { text: botResponse.mensaje_usuario, modelId: "eleven_multilingual_v2", outputFormat: "mp3_44100_128" }
    );

    const chunks = [];
    for await (const chunk of audioStream) chunks.push(chunk);
    const audioBuffer = Buffer.concat(chunks);

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length
    });
    res.send(audioBuffer);

  } catch (err) {
    console.error("Error en /voice-chat:", err);
    res.status(500).json({ error: "Error procesando la conversación" });
  } finally {
    try { fs.unlinkSync(req.file.path); } catch (e) { console.warn("No se pudo eliminar archivo temporal:", e.message); }
  }
});






module.exports = router;