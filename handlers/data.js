const fs = require("fs");
const path = require("path");

function dataHandler(request, response) {
  const filePath = path.join(__dirname, "..", "data", "pokemons.json");
  fs.readFile(filePath, (error, file) => {
    if (error) {
      console.log(error);
      respond.writeHead(500, { "content-type": "application/json" });
      response.end({});
    } else {
      const data = new URLSearchParams(request.url.split("?")[1]);
      const query = data.get("q");
      let pokemons = [];
      let res = JSON.parse(file);

      pokemons = res.results.filter(
        (element) => element.name.indexOf(query.toLowerCase()) == 0
      ).slice(0, 10);

      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(pokemons));
    }
  });
}

module.exports = dataHandler;
