const express = require("express");
const router = express.Router();

const WhatsappController = require("../controllers/whatsappControllers")

router
.get("/", WhatsappController.verifyToken)
.post("/", WhatsappController.receivedMessage)

module.exports = router;