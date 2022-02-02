const express = require("express");
const authMiddleware = require("../middlewares/AuthMiddleware");
const UsersController = require("../controllers/UsersController");
const RequestController = require("../controllers/RequestController");
const userRouter = express.Router();

userRouter.post(
  "/deleteFriend",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  RequestController.deleteFriend
);

userRouter.post(
  "/declineRequest",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  RequestController.declineFriendRequest
);

userRouter.post(
  "/acceptRequest",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  RequestController.acceptFriendRequest
);

userRouter.post(
  "/sendRequest",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  RequestController.sendFriendRequest
);

userRouter.get(
  "/:id",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  UsersController.findSingleUser
);

userRouter.get(
  "/",
  authMiddleware.veryfiedToken,
  authMiddleware.checkToken,
  UsersController.getAllUsers
);

module.exports = userRouter;
