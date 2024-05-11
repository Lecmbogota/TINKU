const express = require("express");
const router = express.Router();

const WhatsappController = require("../controllers/whatsappControllers")

router
  .get("/", WhatsappController.verifyToken) // Verificar token
  .post("/", WhatsappController.receivedMessage) // Manejar mensajes recibidos
  .get("/msgs", WhatsappController.getReceivedMessages); // Obtener mensajes recibidos

module.exports = router;
