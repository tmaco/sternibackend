const express = require("express");
const PlayerController = require("../controllers/player");

const md_auth = require("../middleware/authenticate");


const api = express.Router();

api.get("/get-players", PlayerController.getPlayers);
api.get("/get-players-all", PlayerController.getPlayersAll);
api.get("/get-team-players/:teamName", PlayerController.getPlayersByTeam);
api.get("/get-position-players/:position", PlayerController.getPlayersByPosition);
api.get("/get-player/:playerName", PlayerController.getPlayer);
api.get("/get-list-players/:playersName", PlayerController.getListPlayers);
api.get("/get-player-id/:playerId", PlayerController.getPlayerId);
api.get("/get-players-data/:team", [md_auth.ensureAdmin], PlayerController.getPlayersData);
api.put("/update-players-name", [md_auth.ensureAdmin], PlayerController.updateDisplayName);
api.put("/update-players-avatar", [md_auth.ensureAdmin], PlayerController.updateAvatar);
api.put("/update-player-team/:id", [md_auth.ensureAdmin], PlayerController.updatePlayerTeam);
api.put("/update-player-status/:id", [md_auth.ensureAdmin], PlayerController.updatePlayerStatus);
api.get("/get-rookies/:season", PlayerController.getRookies);

module.exports = api;