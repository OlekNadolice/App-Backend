const User = require("../models/User");
const { body, check } = require("express-validator");

const validation = [
  body("email")
    .isEmail()
    .withMessage("Email must be a valid email!")
    .normalizeEmail()
    .toLowerCase()
    .custom(async value => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Email is already used");
        }
      } catch (err) {
        return false;
      }
    })
    .withMessage("email already exists!"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password length minimum 6 characters!"),
  body("name").not().isEmpty().withMessage("Name  field cant be empty!"),
];

module.exports = validation;
