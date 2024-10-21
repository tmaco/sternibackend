const express = require("express");
const NewsPlayerController = require("../controllers/newsPlayer");

const md_auth = require("../middleware/authenticate");

const api = express.Router();

api.put("/get-news-data", [md_auth.ensureAdmin], NewsPlayerController.getNewsData);
api.get("/get-news-player", NewsPlayerController.getNewsPlayers);


module.exports = api;