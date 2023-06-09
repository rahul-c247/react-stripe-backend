const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { handleValidationErrors } = require("../middleware/handleValidationErr");
const { loginValidation, registrationValidate, updatePasswordValidation } = require("../validator/validation");
const { verifyToken } = require("../middleware/validateToken");
const { userValidateToken } = require("../middleware/userValidate");

router.post("/registration", registrationValidate, handleValidationErrors, userController.register);
router.post("/login", loginValidation, handleValidationErrors, userController.login);
router.get("/profile", verifyToken, userController.getUserById);
router.post("/oauth", userController.loginWithOauth);
router.post("/change-password", updatePasswordValidation, handleValidationErrors, verifyToken, userController.changePassword
);

module.exports = router;