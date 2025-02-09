const express = require("express");
const { tanyaShoppingAssistant } = require("../controllers/tanyaAssistantController.js");

const router = express.Router();

// Ensure correct async error handling
router.post("/web-bff/assistant", (req, res, next) => {
  tanyaShoppingAssistant(req, res, next).catch(next);
});

module.exports = router;
