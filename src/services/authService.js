const bcrypt = require("bcrypt");
const jsontoken = require("jsonwebtoken");

const User = require("../models/User");
const { validationResult } = require("express-validator");

module.exports.loginUserToApplication = async req => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const password = await bcrypt.compare(req.body.password, user.password);

    if (password) {
      const token = jsontoken.sign({ id: user.id }, process.env.JWTPASSWORD);
      const data = { name: user.name, profileImage: user.profileImage, id: user._id };

      return { status: 201, data, token };
    } else {
      return { status: 401, message: "The password you entered is incorrect" };
    }
  } else {
    return { status: 401, message: "The email you entered is incorrect" };
  }
};

module.exports.registerUserToApplication = async req => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const [, er] = Object.values(errors);
    let output = [];
    er.forEach(error => output.push(error.msg));
    return { output };
  } else {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    User.create({ name, email, password: hashedPassword });
    return { message: "Thanks for registration!", status: 201 };
  }
};

module.exports.veryfiedUser = async req => {
  jsontoken.verify(req.token, process.env.JWTPASSWORD, (err, authData) => {
    if (err) {
      return { status: 403 };
    } else if (authData) {
      return { status: 201, message: "Logged In" };
    }
  });
};

module.exports.loginWithGoogle = async req => {
  let { _id: id, name, profileImage } = req.user;
  const token = jsontoken.sign({ id: req.user._id }, process.env.JWTPASSWORD);
  profileImage = btoa(profileImage);
  return { id, name, profileImage, token };
};
