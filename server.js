const path = require("path");
const fs = require("fs");
const express = require("express");
const jwt = require("jsonwebtoken");
const verifyUser = require("./middleware/verifyUser.js");
const cookieparser = require("cookie-parser");
const dataHandler = require("./handlers/data.js");
let pokemonArray = [];
let users = require("./data/userspokemon.json");

const SECRET = verifyUser.SECRET;
const PORT = process.env.PORT || 3000;

const server = express();

server.use(cookieparser());
server.use(express.urlencoded());
server.use(express.json());

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
  const token = jwt.sign(email, SECRET);
  res.cookie("user", token);
  pokemonArray = checkUser(email) || [];
  res.redirect("/");
});

server.get("/log-out", (req, res) => {
  res.clearCookie("user");
  pokemonArray = [];
  res.redirect("/");
});

server.get("/check-login", (req, res) => {
  let pokemonarr = checkUser(req.user);
  res.send({ exists: !!req.user, data: pokemonarr });
});

server.post("/pokemon/favorite", (req, res) => {
  const pokemon = req.body;
  const userObj = findUser(req.user);
  let i = users.findIndex((element) => element === userObj);
  pokemonArray = checkUser(req.user) || [];
  if (pokemon.check == 1) {
    pokemonArray.push({ name: pokemon.pokemon, image: pokemon.src });
  } else {
    pokemonArray = pokemonArray.filter((element) => element.name != pokemon.pokemon);
  }
  users[i].pokemons = [...pokemonArray];
  saveUsersPokeomn();
  res.send(users[i].pokemons);
});

server.use(express.static(path.join(__dirname, "www")));

//functions
function findUser(user) {
  if (user) {
    return users.find(
      (element) =>
        // console.log(element["user"].toLowerCase());
        // console.log(element["user"]);
        // console.log(user);
        element["user"].toLowerCase() === user.toLowerCase()
    );
  }
}

function checkUser(name) {
  console.log(name);
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
