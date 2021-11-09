const http = require("http");
const port = process.env.PORT || 3000;
const path = require("path");
const express = require("express");
const cookieparser = require("cookie-parser");
const dataHandler = require("./handlers/data.js");

const server = express();
server.use(cookieparser());
server.use(express.urlencoded());

server.listen(port, () =>
  console.log(`listening on http://localhost:${port}....`)
);

server.get("/", (req, res) => {
  res.sendfile(path.join(__dirname));
});
server.get("/data/pokemon/:name", dataHandler);

server.use(express.static(path.join(__dirname, "www")));
