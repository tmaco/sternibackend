const express = require("express");
const StatusPlayerController = require("../controllers/statusPlayer");

//const md_auth = require("../middleware/authenticate");

const api = express.Router();

api.get("/get-status-data", StatusPlayerController.getStatusData);
api.get("/get-status-player", StatusPlayerController.getStatusPlayers);


module.exports = api;