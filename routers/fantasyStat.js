const express = require("express");
const FantasyStatController = require("../controllers/fantasyStat");

const md_auth = require("../middleware/authenticate");


const api = express.Router();

api.get("/get-total-fantasy/:playerName", FantasyStatController.getTotalFantasyStatsByPlayer);
api.get("/get-season-fantasy/:playerName", FantasyStatController.getTotalFantasyStatsBySeasonPlayerApi);
api.get("/get-fantasy/:playerName", FantasyStatController.getFantasyStatsByPlayer);
api.get("/get-fantasy-league/:playerName", FantasyStatController.getFantasyStatsByLeague);
api.get("/get-fantasy-match/:playerName", FantasyStatController.getFantasyStatsByPlayerAndMatch);
api.get("/get-fantasy-season/:league", FantasyStatController.getFantasyStatsBySeason);
api.put("/update-fantasy-name", [md_auth.ensureAdmin], FantasyStatController.updateFantasyDisplayName);
api.post("/add-fantasy/:league", [md_auth.ensureAdmin], FantasyStatController.getFantasyStatsData);


module.exports = api;