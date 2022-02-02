const User = require("../models/User");
const jsontoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

module.exports.loginHandler = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    const password = await bcrypt.compare(req.body.password, user.password);

    if (password) {
      const token = jsontoken.sign({ id: user.id }, process.env.JWTPASSWORD);
      const data = { name: user.name, profileImage: user.profileImage, id: user._id };
      res.json({ status: 201, data, token });
    } else {
      res.json({ status: 401, message: "The password you entered is incorrect" });
    }
  } else {
    res.json({ status: 401, message: "The email you entered is incorrect" });
  }
};

module.exports.veryfiedUser = async (req, res) => {
  jsontoken.verify(req.token, process.env.JWTPASSWORD, (err, authData) => {
    if (err) {
      res.status(403).send("doesnt work");
    } else if (authData) {
      res.json({ status: 201, message: "Logged In" });
    }
  });
};

module.exports.facebookOauth = async (req, res) => {
  try {
    res.send("Wszystko dziala mozna robic konto");
  } catch (err) {
    console.log(err);
  }
};

module.exports.registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const [, er] = Object.values(errors);
    let output = [];
    er.forEach(error => output.push(error.msg));

    res.status(400).send({ output });
  } else {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    User.create({ name, email, password: hashedPassword });
    res.json({ message: "Thanks for registration!", status: 201 });
  }
};

module.exports.loginWithGoogle = (req, res) => {
  let { _id: id, name, profileImage } = req.user;
  const token = jwt.sign({ id: req.user._id }, process.env.JWTPASSWORD);
  profileImage = btoa(profileImage);

  res.redirect(`http://localhost:3000/veryfied/${token}/${id}/${name}/${profileImage}`);
};
