const jwt = require("jsonwebtoken");
const SECRET = "nkA$SD82&&282hd";
function getUser(req, res, next) {
  const token = req.cookies.user;
  console.log(req.cookies);
  if (token) {
    const user = jwt.verify(token, SECRET);
    req.user = user;
  }
  next();
}
module.exports = { getUser, SECRET };
