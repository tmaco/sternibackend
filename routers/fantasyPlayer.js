const express = require("express");
const FantasyPlayerController = require("../controllers/fantasyPlayer");

const md_auth = require("../middleware/authenticate");

const api = express.Router();

api.get("/get-fantasyplayers", FantasyPlayerController.getFantasyPlayers);
api.put("/activate-fantasyplayer/", [md_auth.ensureAuth], FantasyPlayerController.activateFantasyPlayer);
api.post("/add-fantasyplayers", [md_auth.ensureAdmin], FantasyPlayerController.addFantasyPlayers);
api.put("/update-fantasyplayers-avatar", [md_auth.ensureAdmin], FantasyPlayerController.updateAvatarFantasyPlayer);


module.exports = api;