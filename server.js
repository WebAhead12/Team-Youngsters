const path = require("path");
const fs = require("fs");
const express = require("express");
const jwt = require("jsonwebtoken");
const getUser = require("./middleware/getUser.js");
const cookieparser = require("cookie-parser");
const dataHandler = require("./handlers/data.js");
const pokemonArray = [];
const users = [];

const SECRET = getUser.SECRET;
const PORT = process.env.PORT || 3000;

const server = express();

server.use(cookieparser());
server.use(express.urlencoded());

server.use(getUser.getUser);

server.listen(PORT, () => console.log(`listening on http://localhost:${PORT}....`));

server.get("/", (req, res) => {
  res.sendfile(path.join(__dirname, "www", "index.html"));
});

server.get("/log-in", (req, res) => {
  res.sendfile(path.join(__dirname, "www", "loginpage.html"));
});

server.get("/data/pokemon/:name", dataHandler);

server.post("/log-in", (req, res) => {
  const email = req.body.email;
  const username = email.split("@")[0];
  fs.writeFileSync(path.join(__dirname, "data", "userspokemon.json"), JSON.stringify({ user: username, pokemons: [] }, undefined, 2));
  const token = jwt.sign(email, SECRET);
  res.cookie("user", token);
  res.redirect("/");
});

server.get("/log-out", (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
});

server.get("/check-login", (req, res) => {
  res.send({ exists: !!req.user });
});

server.use(express.static(path.join(__dirname, "www")));
