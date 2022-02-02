const express = require("express");
const messengerRouter = express.Router();
const authMiddleware = require("../middlewares/AuthMiddleware");
const messengerController = require("../controllers/MessengerController");

messengerRouter.get(
  "/",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  messengerController.getFriends
);

module.exports = messengerRouter;
