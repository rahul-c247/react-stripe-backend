const express = require("express");
const stripeController = require("../controllers/stripe");
const router = express.Router();

/* router.get("/config", stripeController.config); */
router.post("/create-payment-intent", stripeController.createIntent);

module.exports = router;