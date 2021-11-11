const fs = require("fs");
const path = require("path");
let users = require("../data/userspokemon.json");
function findUser(user) {
  if (user) {
    return users.find((element) => {
      return element["user"] === user;
    });
  }
}

function updateUsersPokeomn(name) {
  if (findUser(name)) {
    return findUser(name)["pokemons"];
  } else {
    [];
  }
}

function checkUser(name) {
  if (findUser(name)) {
    return false;
  } else {
    users.push({ user: name, pokemons: [] });
    saveUsersPokeomn();
    return true;
  }
}

function saveUsersPokeomn() {
  fs.writeFileSync(path.join(__dirname, "..", "data", "userspokemon.json"), JSON.stringify(users, undefined, 2));
}

module.exports = { findUser, updateUsersPokeomn, checkUser, saveUsersPokeomn };
