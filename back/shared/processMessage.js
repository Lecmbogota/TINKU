const whatsappModel = require("../shared/whatsappModels");
const whatsappService = require("../services/whatsappService");

function Process(textUser, number) {
  textUser = textUser.toLowerCase(); // Corregir función toLowerCase
  var models = [];

  if (textUser.includes("hola")) {
    // Saludar
    var model = whatsappModel.MessageText("Hola, ¡un gusto saludarte!", number);
    models.push(model);
  }

  else if (textUser.includes("adios") || textUser.includes("adiós") || textUser.includes("chao")) {
    // Despedida
    var model = whatsappModel.MessageText("Gracias por contactarnos ❤", number);
    models.push(model);
  }

  else{
    // No entiende el mensaje del usuario
    var model = whatsappModel.MessageText("No entiendo lo que dices", number);
    models.push(model);
  }

  // Enviar todos los modelos
  models.forEach(model => {
    whatsappService.SendMessageWhatsapp(model);
  });
}

module.exports = {
    Process,
};
