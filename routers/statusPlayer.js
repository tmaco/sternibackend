const express = require("express");
const StatusPlayerController = require("../controllers/statusPlayer");

const md_auth = require("../middleware/authenticate");

const api = express.Router();

api.get("/get-status-data", [md_auth.ensureAdmin], StatusPlayerController.getStatusData);
api.put("/get-status-inj-data", [md_auth.ensureAdmin], StatusPlayerController.getStatusInjData);
api.get("/get-status-player", StatusPlayerController.getStatusPlayers);


module.exports = api;