const fs = require("fs");
const path = require("path");

const homeHandler = (request, response) => {
  const filePath = path.join(__dirname, "..", "www", "index.html");
  fs.readFile(filePath, (error, file) => {
    if (error) {
      console.log(error);
      respond.writeHead(500, { "content-type": "text/html" });
      response.end("<h1>index.html not found</h1>");
    } else {
      response.writeHead(200, { "content-type": "text/html" });
      response.end(file);
    }
  });
};

module.exports = homeHandler;
