const express = require("express");
const router = express.Router();

const WhatsappController = require("../controllers/whatsappControllers")

router
  .get("/msgs", WhatsappController.getReceivedMessages); // Obtener mensajes recibidos

module.exports = router;
