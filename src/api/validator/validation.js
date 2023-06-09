const { body } = require("express-validator");
const User = require("../models/user")

exports.registrationValidate = [
    body("firstName").not().isEmpty().withMessage("First name is required"),
    body("lastName").not().isEmpty().withMessage("Last name is required"),
    body("email")
        .not()
        .isEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("Invalid Email")
        .custom(async (value) => {
            const emailCheck = await User.findOne({ email: value });
            if (emailCheck) {
                throw new Error("email is already exist");
            }
        }),
    body("dob").not().isEmpty().withMessage("DOB is required"),
    body("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
        .isString()
        .isLength({ min: 8 })
        .not()
        .withMessage(" length should be 8 characters")
        .isUppercase()
        .not()
        .withMessage(" one upper case is required")
        .isLowercase()
        .not()
        .withMessage(" one lower case is required")
        .isNumeric()
        .not()
        .withMessage(" one numeric is required"),
    body("gender").not().isEmpty().withMessage("Gender is required"),
]

exports.loginValidation = [
    body("email")
        .not()
        .isEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("Invalid Email")
        .custom(async (value) => {
            const emailCheck = await User.findOne({ email: value });
            if (!emailCheck) {
                throw new Error("Email not present");
            }
        }),
    body("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
]

exports.updatePasswordValidation = [
    body("password")
        .not()
        .isEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 character long.")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
        .withMessage(
            "Please enter a password at least 8 character and contain at least one uppercase, one lower case and one special character."
        )
        .not()
        .matches(/^$|\s+/)
        .withMessage("White space not allowed"),
    body("oldPassword").not().isEmpty().withMessage("Old password is required"),
];
