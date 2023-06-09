const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * decode JWT token
 */
exports.decode = async (token) => {
    return jwt.decode(token, process.env.JWT_SEC);
};


/**
 * Compare the password using bcryptjs algo
 */
exports.comparePassword = async (password, hash) =>
    await bcrypt.compare(password, hash);

/**
* Generates Hash of a password string
*/
exports.encryptPassword = async (password) => bcrypt.hashSync(password, 10);

/**
* Generates Token
*/

exports.generateToken = async (payload) => {
    const token = await jwt.sign(payload, process.env.JWT_SEC, {
        expiresIn: "1d",
    });
    return token;
};