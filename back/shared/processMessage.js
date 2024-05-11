const whatsappModel = require("../shared/whatsappModels");
const whatsappService = require("../services/whatsappService");

function process(textUser, number) {
  textUser = textUser.toLowerCase(); // Corregir función toLowerCase
  const models = [];

  if (textUser.includes("hola")) {
    // Saludar
    const model = whatsappModel.MessageText("Hola, ¡un gusto saludarte!", number);
    models.push(model);
  }

  if (textUser.includes("adios") || textUser.includes("adiós")) {
    // Despedida
    const model = whatsappModel.MessageText("Gracias por contactarnos ❤", number);
    models.push(model);
  }

  if (models.length === 0) {
    // No entiende el mensaje del usuario
    const model = whatsappModel.MessageText("No entiendo lo que dices", number);
    models.push(model);
  }

  // Enviar todos los modelos
  models.forEach((model) => {
    whatsappService.SendMessageWhatsapp(model.text, model.number);
  });
}

module.exports = {
  process,
};
