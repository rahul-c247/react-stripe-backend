const { Router } = require("express");
const registrationRoute = require("./user");
const stripeRoute = require("./stripe");
const router = Router();


router.use("/", registrationRoute);
router.use("/stripe", stripeRoute);

module.exports = router;
