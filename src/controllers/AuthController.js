const authService = require("../services/authService");

module.exports.loginHandler = async (req, res) => {
  const data = await authService.loginUserToApplication(req);
  res.json(data);
};

module.exports.veryfiedUser = async (req, res) => {
  const data = await authService.veryfiedUser(req);
  res.json(data);
};

module.exports.registerUser = async (req, res) => {
  const data = await authService.registerUserToApplication(req);
  res.json(data);
};

module.exports.loginWithGoogle = async (req, res) => {
  const { name, token, id, profileImage } = await authService.loginWithGoogle(req);
  res.redirect(`http://localhost:3000/veryfied/${token}/${id}/${name}/${profileImage}`);
};
