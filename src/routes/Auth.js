const express = require("express");

const passport = require("../passportSetup");

const authRouter = express.Router();
const validation = require("../validation");
const authController = require("../controllers/AuthController");
const authMiddleware = require("../middlewares/AuthMiddleware");
const settingsController = require("../controllers/SettingsController");
const RequestController = require("../controllers/RequestController");
const UsersController = require("../controllers/UsersController");

authRouter.post("/register", validation, authController.registerUser);

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
  authController.loginWithGoogle
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
  "/user/:id",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  UsersController.findSingleUser
);

authRouter.get(
  "/users",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  UsersController.getAllUsers
);

module.exports = authRouter;
