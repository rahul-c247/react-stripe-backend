const User = require("../models/user");
const { message } = require("../common/message");
const { comparePassword, encryptPassword, generateToken } = require("../common/password")
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
dotenv.config();

exports.register = async (req, res) => {
  try {
    const { firstName, lastName,email,dob, password ,confirmPassword,linkedinUrl,gender} = req.body;
    const hashedPassword = await encryptPassword(password);
    const registrationData = await User.create({
      firstName,
      lastName,
      email,
      dob,
      password: hashedPassword,
      /* confirmPassword,
      linkedinUrl, */
      gender
    });

    return res.status(200).json({
      success: true,
      message: message.DATA_ADD_SUCCESS,
      data: registrationData,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: message.ERROR_MESSAGE,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDetail = await User.findOne({ email });

    const accessToken = await generateToken({
      id: userDetail._id,
    });

    const isPasswordCorrect = await comparePassword(
      password,
      userDetail.password
    );

    if (!isPasswordCorrect) {
      return res.status(500).json({
        message: "Password is incorrect",
      });
    }
    return res.status(200).json({
      message: message.LOGIN_SUCCESS,
      email: userDetail.email,
      accessToken
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: message.ERROR_MESSAGE,
    });
  }
};

// Handle single user data fetch
exports.getUserById = async (req, res) => {
  const { userId } = req;
  const userDetails = await User.findById({ _id: userId });
  console.log("userDetails...", userDetails)
  const details = {
    _id: userDetails._id,
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    email: userDetails.email,
    dob: userDetails.dob,
    gender: userDetails.gender,
  }
  return res.status(200).json({
    details
  });
};

// Handle Login with Gooogle 
exports.loginWithOauth = async (req, res) => {
  //console.log("res... ",req)
  try {
    const { email } = req.body;
    const user = await User.findOne(
      {
        email: email
      }
    );
    console.log("email...",email)
    if (!user) {
      const registrationData = await User.create({
        email,
        // password: CryptoJS.AES.encrypt(password,
        //   process.env.PASS_SEC
        // ).toString(),
      });

      return res.status(200).json({
        success: true,
        message: message.DATA_ADD_SUCCESS,
        data: registrationData,
      });
    }
    //!user && res.status(401).json("Wrong User Name");
    // const hashedPassword = CryptoJS.AES.decrypt(
    //   user.password,
    //   process.env.PASS_SEC
    // );
    // const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    // const inputPassword = req.body.password;
    // if (originalPassword != inputPassword) {
    //   return res.status(401).json("Invalid Password");
    // }
    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SEC,
      { expiresIn: "1d" }
    );
    console.log("accessToken..",accessToken)
    return res.status(200).json({
      message: message.LOGIN_SUCCESS,
      email: user.email,
      accessToken
    });
  } catch (error) {
    console.log(error,"error in abckend")
    return res.status(500).json({
      message: message.ERROR_MESSAGE,
    });
  }
};

// change pasword

exports.changePassword = async (req, res) => {
  try {
    const { userId } = req;
    const { oldPassword, password } = req.body;
    const profileDetail = await User.findById({ _id: userId });
    const isPasswordCorrect = await comparePassword(
      oldPassword,
      profileDetail.password
    );
    const hashedPassword = await encryptPassword(password);
    console.log("isPasswordCorrect..", isPasswordCorrect, oldPassword, password)
    if (!isPasswordCorrect) {
      return res.status(500).json({
        messages: message.OLD_PASSWORD_INCORRECT,
      });
    } else {
      if (oldPassword == password) {
        return res.status(500).json({
          errMessage: message.PASSWORD_MATCH_ERROR,
        });
      }

      const updateProfile = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            password: hashedPassword,
            confirmPassword: password
          },
        },
        { new: true }
      );
      console.log("updateProfile..", updateProfile)
      return res.status(200).json({
        successMessage: message.CHANGE_PASSWORD_SUCCESS,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: message.ERROR_MESSAGE,
    });
  }
};