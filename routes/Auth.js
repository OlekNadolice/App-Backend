const express = require("express");
const User = require("../models/User");
const passport = require("../passportSetup");
const { body, validationResult, check } = require("express-validator");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const authController = require("../controllers/AuthController");
const authMiddleware = require("../middlewares/AuthMiddleware");
const settingsController = require("../controllers/SettingsController");
const RequestController = require("../controllers/RequestController");
const { set } = require("mongoose");
const { urlencoded } = require("express");

authRouter.post(
  "/register",
  [
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
  ],
  authController.registerUser
);

authRouter.post("/login", authController.loginHandler);

authRouter.post("/verify", authMiddleware.veryfiedToken, authController.veryfiedUser);

/** OPEN AUTHENTICATION WITH google **/
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/",
    failureMessage: true,
  }),
  function (req, res) {
    let { _id: id, name, profileImage } = req.user;
    const token = jwt.sign({ id: req.user._id }, process.env.JWTPASSWORD);
    profileImage = btoa(profileImage);

    res.redirect(`http://localhost:3000/veryfied/${token}/${id}/${name}/${profileImage}`);
  }
);

authRouter.post(
  "/sendRequest",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  RequestController.sendFriendRequest
);

authRouter.post(
  "/acceptRequest",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  RequestController.acceptFriendRequest
);

authRouter.post(
  "/declineRequest",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  RequestController.declineFriendRequest
);

authRouter.post(
  "/deleteFriend",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  RequestController.deleteFriend
);

authRouter.post(
  "/update",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  settingsController.UpdateImage
);

authRouter.post(
  "/updateUserInfo",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  settingsController.UpdateUserInfo
);

authRouter.post(
  "/deleteAccount",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  settingsController.deleteAccount
);

authRouter.get(
  "/users",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  async (req, res) => {
    let users = await User.find({});
    const count = await User.countDocuments();

    users = users.map(element => {
      return {
        name: element.name,
        profileImage: element.profileImage,
        city: element.city,
        id: element.id,
      };
    });

    if (req.query.name) {
      const { name } = req.query;
      const queryString = name.replace(",", " ");
      users = await User.findOne({ name: queryString });
    }

    if (req.query.type && req.query.id) {
      const { id, type } = req.query;
      users = await User.findOne({ _id: id }).select(type);

      if (Array.isArray(users[type]) && users[type].length > 0) {
        users = await User.findOne({ _id: id })
          .select(type)
          .populate(type, "name profileImage _id");
        console.log("jest arrayem");
      }
    } else if (req.query.id) {
      const { id } = req.query;
      users = await User.findOne({ _id: id })
        .select("name")
        .select("city")
        .select("profileImage")
        .select("friends")
        .select("friendsRequests");
    }

    if (req.query.page) {
      const page = req.query.page || 1;
      const limit = 8;
      const skip = (page - 1) * limit;
      users = await User.find({})
        .select("name")
        .select("profileImage")
        .select("city")
        .limit(limit)
        .skip(skip);
    }

    res.json({ data: users, count: count });
  }
);

module.exports = authRouter;
