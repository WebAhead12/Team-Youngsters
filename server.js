const path = require("path");
const fs = require("fs");
const express = require("express");
const jwt = require("jsonwebtoken");
const verifyUser = require("./middleware/verifyUser.js");
const cookieparser = require("cookie-parser");
const dataHandler = require("./handlers/data.js");
const pokemonArray = [];
let users = require("./data/userspokemon.json");

const SECRET = verifyUser.SECRET;
const PORT = process.env.PORT || 3000;

const server = express();

server.use(cookieparser());
server.use(express.urlencoded());

server.use(verifyUser.verifyUser);

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
  checkUser(email.split("@")[0]);

  const token = jwt.sign(email, SECRET);
  res.cookie("user", token);
  res.redirect("/");
});

server.get("/log-out", (req, res) => {
  res.clearCookie("user");
  pokemonArray = [];
  res.redirect("/");
});

server.get("/check-login", (req, res) => {
  res.send({ exists: !!req.user });
});

server.post("/pokemon/favorite", (req, res) => {
  const pokemon = req.body;
  if (pokemon.check == 1) {
  } else {
  }
});

server.use(express.static(path.join(__dirname, "www")));

//functions
function findUser(user) {
  return users.find((element) => element["user"].toLowerCase() === user.toLowerCase());
}

function checkUser(name) {
  if (findUser(name)) {
    return findUser(name)["pokemons"];
  } else {
    users.push({ user: name, pokemons: [] });
    saveUsersPokeomn();
  }
}

function saveUsersPokeomn() {
  fs.writeFileSync(path.join(__dirname, "data", "userspokemon.json"), JSON.stringify(users, undefined, 2));
}
