const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, },
    lastName: { type: String, },
    email: { type: String, required: true, unique: true },
    dob: { type: String, },
    password: { type: String, },
    /* confirmPassword: { type: String, }, */
    /* linkedinUrl: { type: String, }, */
    gender: {type: String,},
    /* isAdmin: {
      type: Boolean,
      default: false,
    }, */
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);