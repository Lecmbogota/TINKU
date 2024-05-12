const express = require("express");
const router = express.Router();

const WhatsappController = require("../controllers/whatsappControllers")

router
  .post('/', WhatsappController.sendMsg);
module.exports = router;
