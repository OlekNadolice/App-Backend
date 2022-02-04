const express = require("express");
const passport = require("../passportSetup");
const authRouter = express.Router();

const validationMiddleware = require("../middlewares/validationMiddleware");
const authController = require("../controllers/AuthController");
const authMiddleware = require("../middlewares/AuthMiddleware");
const settingsController = require("../controllers/SettingsController");

authRouter.post("/register", validationMiddleware, authController.registerUser);
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
    failureRedirect: process.env.CLIENT_ORIGIN,
    failureMessage: true,
  }),
  authController.loginWithGoogle
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

module.exports = authRouter;
