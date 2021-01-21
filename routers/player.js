const express = require("express");
const PlayerController = require("../controllers/player");

const md_auth = require("../middleware/authenticate");


const api = express.Router();

api.get("/get-players", PlayerController.getPlayers);
api.get("/get-team-players/:teamName", PlayerController.getPlayersByTeam);
api.get("/get-player/:playerName", PlayerController.getPlayer);
api.get("/get-player-id/:playerId", PlayerController.getPlayerId);
api.get("/get-players-data/:team", [md_auth.ensureAdmin], PlayerController.getPlayersData);
api.put("/update-players-name", [md_auth.ensureAdmin], PlayerController.updateDisplayName);


module.exports = api;