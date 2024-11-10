const express = require("express");
const NewsPlayerController = require("../controllers/newsPlayer");

const md_auth = require("../middleware/authenticate");

const api = express.Router();

api.put("/get-news-data", [md_auth.ensureAdmin], NewsPlayerController.getNewsData);
api.get("/get-news-player", NewsPlayerController.getNewsPlayers);
api.get("/get-news-player-id/:playerId", NewsPlayerController.getNewsPlayer);
api.put("/update-news-key", NewsPlayerController.updateNewsKey);

module.exports = api;