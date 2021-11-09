const homeHandler = require("./handlers/home.js");
const wwwHandler = require("./handlers/www.js");
const dataHandler = require("./handlers/data.js");

const router = (request, response) => {
  const url = request.url;
  console.log(url);
  if (url === "/") {
    homeHandler(request, response);
  } else if (url.includes("data")) {
    dataHandler(request, response);
  } else if (url.includes("www")) {
    wwwHandler(request, response);
  } else {
    response.writeHead(404, { "content-type": "text/html" });
    response.end("<h1>Nothing is here!</h1>");
  }
};

module.exports = router;
