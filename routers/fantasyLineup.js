const express = require("express");
const FantasyLineupController = require("../controllers/fantasyLineup");

const md_auth = require("../middleware/authenticate");

const api = express.Router();

api.post("/add-lineup", [md_auth.ensureAuth], FantasyLineupController.addLineup);
api.post("/add-player-lineup/:id", [md_auth.ensureAuth], FantasyLineupController.addPlayerLineup);
api.get("/get-lineup", FantasyLineupController.getFantasyLineup);
api.get("/get-fantasy-lineup-id", FantasyLineupController.getFantasyLineupId);
api.get("/get-fantasy-lineup-limit/:id", FantasyLineupController.getFantasyLineupLimit);
api.get("/get-fantasy-lineup", FantasyLineupController.getUserFantasyLineup);
api.put("/update-lineup/:id", [md_auth.ensureAuth], FantasyLineupController.updateFantasyLineup);
api.delete("/delete-player-lineup/:id", [md_auth.ensureAuth], FantasyLineupController.deletePlayerFantasyLineup);



module.exports = api;