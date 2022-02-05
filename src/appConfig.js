const express = require("express");

const app = express();

const cors = require("cors");

const authRouter = require("./routes/Auth");
const messengerRouter = require("./routes/Messenger");
const userRouter = require("./routes/Users");
const fileUpload = require("express-fileupload");

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    allowedHeaders: "* ",
    methods: "*",
    credentials: true,
  })
);

app.use(fileUpload({ createParentPath: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/messenger", messengerRouter);
app.use("/users", userRouter);
app.use(express.static("src/uploads"));
app.use("/images", express.static("src/uploads"));

module.exports = app;
