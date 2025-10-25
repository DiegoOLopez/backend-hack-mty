const { Tool } = require('langchain/tools');

export const transferTool = new Tool({
  name: "transfer",
  description: "Transfiere dinero de un usuario a otro",
  func: async (input) => {
    const { to, amount } = input;

    if (!to || !amount) {
      // Lanzamos un error controlado que el agente puede usar
      throw new Error(
        JSON.stringify({
          missing: ["to", "amount"].filter((k) => !input[k]),
        })
      );
    }

    return `Simulando transferencia de ${amount} a ${to}`;
  },
});


export const paymentTool = new Tool({
  name: "payment",
  description: "Realiza un pago en línea",
  func: async (input) => {
    return `Simulando pago de ${input.amount} a ${input.merchant}`;
  },
});

export const balanceTool = new Tool({
  name: "balance",
  description: "Consulta el saldo de un usuario",
  func: async () => {
    return `Tu saldo es de $10,000`;
  },
});
