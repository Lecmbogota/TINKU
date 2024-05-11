const whatsappModel = require("../shared/whatsappModels");
const whatsappService = require("../services/whatsappService");

function process(textUser, number) {
  textUser = textUser.toLowCase();
  var models = [];
  if (textUser.includes("hola")) {
    // Saludar
    var model = whatsappModel.MessageText("hola un gusto saludarte", number);
    models.push(model);
  }

  if (textUser.includes("adios") || textUser.includes("adiós")) {
    // Despedida
    var model = whatsappModel.MessageText("Gracias Por Contactactarnos ❤", number);
    models.push(model);
  }
  else{
    // No entiende el mensaje del usuario
    var model = whatsappModel.MessageText("no entiendo lo que dices", number);
    models.push(model);
  }

  models.forEach((model) => {
    whatsappService.SendMessageWhatsapp(model);
  });
}
module.exports = {
  process,
};
