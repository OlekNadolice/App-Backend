const jsontoken = require("jsonwebtoken");

module.exports.veryfiedToken = async (req, res, next) => {
  const bearerHeader = await req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    req.token = bearerToken;
    next();
  } else {
    res.status(403).send("FORBIDDEN !");
  }
};

module.exports.checkToken = async (req, res, next) => {
  try {
    await jsontoken.verify(req.token, process.env.JWTPASSWORD, (err, data) => {
      if (err) {
        res.status(403).send("Forbidden ");
      } else {
        req.id = data.id;
        next();
      }
    });
  } catch (er) {
    console.log(er);
  }
};
