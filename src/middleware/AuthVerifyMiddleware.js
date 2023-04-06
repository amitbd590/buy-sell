const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    let token = req.headers["token"];
    let dataToken = await JWT.verify(
      token,
      `${process.env.JWT_AUTH_SECRET_KEY}`
    );

    let email = dataToken["data"];
    req.headers.email = email;
    next();
  } catch (e) {
    res.status(401).json({ status: "Unauthorized", Error: e });
  }
};
