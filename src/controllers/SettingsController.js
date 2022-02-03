const settingsService = require("../services/settingsService");

module.exports.UpdateImage = async (req, res) => {
  const data = await settingsService.updateImage(req);
  res.json(data);
};

module.exports.UpdateUserInfo = async (req, res) => {
  const data = await settingsService.updateUserInfo(req);
  res.json(data);
};

module.exports.deleteAccount = async (req, res) => {
  const data = await settingsService.deleteAccount(req);
  res.json(data);
};
