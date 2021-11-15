const express = require("express");
const FantasyPlayerController = require("../controllers/fantasyPlayer");

const md_auth = require("../middleware/authenticate");

const api = express.Router();

api.get("/get-fantasyplayers", FantasyPlayerController.getFantasyPlayers);
api.get("/get-fantasyplayer/:player", FantasyPlayerController.getFantasyPlayer);
api.put("/activate-fantasyplayer", [md_auth.ensureAuth], FantasyPlayerController.activateFantasyPlayer);
api.post("/add-fantasyplayers", [md_auth.ensureAdmin], FantasyPlayerController.addFantasyPlayers);
api.put("/update-fantasyplayers-avatar", [md_auth.ensureAdmin], FantasyPlayerController.updateAvatarFantasyPlayer);
api.put("/set-il-fplayer/:id", [md_auth.ensureAdmin], FantasyPlayerController.isILFPlayer);
api.get("/get-all-fantasyplayers", FantasyPlayerController.getAllFantasyPlayers);


module.exports = api;