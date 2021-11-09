const http = require("http");
const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
// const getUser = require("./middleware/getUser.js");
const cookieparser = require("cookie-parser");
const dataHandler = require("./handlers/data.js");

const SECRET = "nkA$SD82&&282hd";
const PORT = process.env.PORT || 3000;

const server = express();

server.use(cookieparser());
server.use(express.urlencoded());

// server.use(getUser);
server.listen(PORT, () =>
  console.log(`listening on http://localhost:${PORT}....`)
);

server.get("/", (req, res) => {
  res.sendfile(path.join(__dirname, "www", "index.html"));
});

server.get("/log-in", (req, res) => {
  res.sendfile(path.join(__dirname, "www", "loginpage.html"));
});

server.get("/data/pokemon/:name", dataHandler);

server.post("/log-in", (req, res) => {
  const email = req.body.email;
});
server.use(express.static(path.join(__dirname, "www")));
