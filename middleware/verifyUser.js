const jwt = require("jsonwebtoken");
const SECRET = "nkA$SD82&&282hd";
function verifyUser(req, res, next) {
  const token = req.cookies.user;
  if (token) {
    const user = jwt.verify(token, SECRET);
    req.user = user;
  }
  next();
}
module.exports = { verifyUser, SECRET };
