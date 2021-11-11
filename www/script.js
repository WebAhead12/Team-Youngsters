const login = document.querySelector("#log-in");
const pokemonUsers = Array.from(document.querySelectorAll(".userpokemon"));
//favorite
const heart = document.getElementById("heart");
//pokemon search div
const input = document.querySelector(".pokemonSearch");
const results = document.querySelector(".pokemonResults");
const resultsDiv = document.querySelector(".pokemonResults");
//search bar animations
const loginbar = document.querySelector(".loginbar");
const pokemonInput = document.querySelector(".pokemonSearch");
const animationButton = document.querySelector("#search");
const imgholder = document.querySelector(".img-holder");
//pokemon info div
const card = document.querySelector(".card");
const img = document.querySelector(".pokemonImg");
const allTd = document.querySelectorAll("td");
const pokeName = document.querySelector(".name");
const pokeTypes = document.querySelector(".types");
const pokeHeight = document.querySelector(".height");
const pokeWeight = document.querySelector(".weight");
const pokeAbilities = document.querySelector(".abilities");
const pokeType1 = document.querySelector(".type1");
const pokeType2 = document.querySelector(".type2");
// non constant variables
let imageUrl = "";
let heartStatus = "heart-off";
let heartTimes = 0;

checkLogIn();

//pokemon types colors
const typeColors = {
  grass: (a = 1) => `rgba(120, 197, 128,${a})`,
  fire: (a = 1) => `rgba(240, 128, 48,${a})`,
  water: (a = 1) => `rgba(104, 144, 240,${a})`,
  bug: (a = 1) => `rgba(168, 184, 32,${a})`,
  normal: (a = 1) => `rgba(168, 168, 120,${a})`,
  poison: (a = 1) => `rgba(160, 64, 160,${a})`,
  electric: (a = 1) => `rgba(248, 208, 48,${a})`,
  ground: (a = 1) => `rgba(224, 192, 104,${a})`,
  fairy: (a = 1) => `rgba(238, 153, 172,${a})`,
  fighting: (a = 1) => `rgba(192, 48, 40,${a})`,
  psychic: (a = 1) => `rgba(248, 88, 136,${a})`,
  rock: (a = 1) => `rgba(184, 160, 56,${a})`,
  ghost: (a = 1) => `rgba(112, 88, 152,${a})`,
  ice: (a = 1) => `rgba(152, 216, 216,${a})`,
  dragon: (a = 1) => `rgba(112, 56, 248,${a})`,
  flying: (a = 1) => `rgba(224, 224, 224,${a})`,
};

input.addEventListener("keyup", (event) => {
  resultsDiv.classList.add("pokemonResults");
  fetch("/data/pokemon/" + input.value)
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then((pokemon) => {
      resultsDiv.innerHTML = "";
      pokemon.forEach((poke) => {
        let searchResult = document.createElement("span");
        let emptybreak = document.createElement("br");
        searchResult.textContent = formatString(poke.name);
        searchResult.style.cursor = "pointer";
        resultsDiv.appendChild(searchResult);
        resultsDiv.appendChild(emptybreak);

        searchResult.addEventListener("click", (event) => {
          input.value = searchResult.textContent;
          resultsDiv.classList.remove("pokemonResults");
          resultsDiv.innerHTML = "";
          console.log(10);
          checkLogIn("", checkUsersFavoritePokemons);
          fetchData(poke.url);
          card.style.display = "inline-block";
        });
      });
      if (!input.value.length) {
        resultsDiv.innerHTML = "";
        card.style.display = "none";
      }
    })
    .catch((error) => console.error(error));
});

//animations for the search button
pokemonInput.addEventListener("click", () => {
  pokemonInput.classList.add("testClass");
  setTimeout(() => {
    resultsDiv.classList.remove("hideResults");
    heart.classList.add("fa-heart-o");
    heart.classList.remove("fa-heart");
    heartStatus = "heart-off";
    loginbar.style.display = "flex";
    card.style.display = "none";
    imgholder.style.display = "grid";
  }, 1000);
  pokeType1.innerHTML = " ";
  pokeType2.innerHTML = " ";
});

animationButton.addEventListener("click", () => {
  pokemonInput.classList.remove("testClass");
  resultsDiv.classList.add("hideResults");
  loginbar.style.display = "none";
  card.style.display = "none";
  imgholder.style.display = "none";
});

//pokemon-data => ["pokemon","data"] => "pokemon data" => "Pokemon Data"
const formatString = (string) => {
  let strArray = [];
  string.split("-").forEach((word, index) => {
    strArray[index] = word[0].toUpperCase() + word.slice(1);
  });
  return strArray.join(" ");
};

const fetchData = (url) => {
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then((pokeData) => {
      imageUrl = pokeData.sprites.front_default;
      img.src = imageUrl;
      pokeName.textContent = formatString(pokeData.name);
      pokeHeight.textContent = "Height: " + pokeData.height / 10.0 + "m";
      pokeWeight.textContent = "Weight: " + pokeData.weight / 10.0 + "kg";

      if (pokeData.abilities.length != 0) {
        pokeAbilities.textContent = "Abilities: " + formatString(pokeData.abilities[0].ability.name);
        if (pokeData.abilities.length == 2) {
          pokeAbilities.textContent += "/" + formatString(pokeData.abilities[1].ability.name);
        }
      }

      console.log(formatString(pokeData.types[0].type.name));
      pokeType1.textContent = formatString(pokeData.types[0].type.name);
      pokeType1.style.backgroundColor = typeColors[pokeData.types[0].type.name](0.5);
      pokeType1.style.borderColor = typeColors[pokeData.types[0].type.name]();
      if (pokeData.types.length > 1) {
        pokeType2.textContent = " " + formatString(pokeData.types[1].type.name);
        pokeType2.style.backgroundColor = typeColors[pokeData.types[1].type.name](0.5);
        pokeType2.style.borderColor = typeColors[pokeData.types[1].type.name]();
        pokeType2.style.display = "inline-block";
      } else pokeType2.style.display = "none";

      allTd.forEach((element, index) => {
        element.textContent = pokeData.stats[index].base_stat;
      });
    })
    .catch((error) => console.error(error));
};
function favorite() {
  heartOn();
  if (heartTimes < 6) {
    if (heartStatus == "heart-on") {
      heartTimes++;
      fetch("/pokemon/favorite", {
        method: "POST",
        body: JSON.stringify({ pokemon: pokeName.textContent, src: imageUrl, check: 1 }),
        headers: { "content-type": "application/json" },
      })
        .then((response) => response.json())
        .then((response) => insertUsersPokemons(response));
    } else if (heartStatus == "heart-off") {
      heartTimes--;
      fetch("/pokemon/favorite", {
        method: "POST",
        body: JSON.stringify({ pokemon: pokeName.textContent, check: 0 }),
        headers: { "content-type": "application/json" },
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          insertUsersPokemons(response);
        });
    }
  } else if (heartTimes > 5) {
    heart.classList.add("fa-heart-o");
    heart.classList.remove("fa-heart");
    alert("⚠️ You can't have more than 6 favorite pokemons");
  }
}

heart.addEventListener("click", () => {
  heart.classList.toggle("fa-heart-o");
  heart.classList.toggle("fa-heart");
  if (heartStatus == "heart-on") {
    heartStatus = "heart-off";
    checkLogIn(favorite);
    return heartStatus;
  }
  heartStatus = "heart-on";
  checkLogIn(favorite);
});

//checks if a user is logged in or not
function checkLogIn(cb, cb2) {
  fetch("/check-login")
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.exists) {
        login.textContent = "Log-out";
        login.href = "/log-out";
        heartTimes = response.data.length || 0;
        insertUsersPokemons(response.data);
        if (cb2) {
          console.log(5);
          cb2(response.data);
        }
        if (cb) {
          cb();
        }
      } else {
        login.textContent = "log-in";
        login.href = "/log-in";
        pokemonUsers.forEach((element) => (element.src = "photo.jpg"));
        if (cb2) {
          heart.classList.add("fa-heart-o");
          heart.classList.remove("fa-heart");
        }
        if (cb) {
          heart.classList.add("fa-heart-o");
          heart.classList.remove("fa-heart");
          alert("⚠️ You need to log in to use this feature");
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

function getPokemonUrl(array) {
  return array.map((element) => element.image);
}

function insertUsersPokemons(array) {
  let pokemonsImages = getPokemonUrl(array);
  pokemonUsers.forEach((element) => (element.src = "photo.jpg"));
  for (let i = 0; i < array.length; i++) {
    pokemonUsers[i].src = pokemonsImages[i];
  }
}
//checks if the searched pokemon is in the users favorite pokemons
function checkUsersFavoritePokemons(array) {
  let favoriteCheck = array.find((element) => element["name"].toLowerCase() === pokemonInput.value.toLowerCase());
  console.log(pokemonInput.value);
  if (favoriteCheck) {
    console.log(1);
    heart.classList.add("fa-heart");
    heart.classList.remove("fa-heart-o");
  } else {
    heart.classList.remove("fa-heart");
    heart.classList.add("fa-heart-o");
  }
}

function heartOn() {
  if (heart.classList.contains("fa-heart")) {
    heartStatus = "heart-on";
  } else {
    heartStatus = "heart-off";
  }
}
