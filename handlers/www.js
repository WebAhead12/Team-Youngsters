const fs = require("fs");
const path = require("path");

const type = {
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
  jpg: "image/jpg",
};

const www = (request, response) => {
  const url = request.url;
  const urArr = url.split(".");
  const extension = urArr[1];
  const conType = type[extension];
  const filePath = path.join(__dirname, "..", url);
  fs.readFile(filePath, (error, file) => {
    if (error) {
      console.log(error);
      response.writeHead(404, { "content-type": "text/html" });
      response.end("<h1>File Not Found</h1>");
    } else {
      response.writeHead(200, { "content-type": `${conType}` });
      response.end(file);
    }
  });
};

module.exports = www;
