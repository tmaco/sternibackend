const express = require("express");
const PlayerStatController = require("../controllers/playerStat");

const md_auth = require("../middleware/authenticate");

const api = express.Router();

api.get("/get-total-stats/:playerName", PlayerStatController.getTotalStatsByPlayer);
api.get("/get-season-stats/:playerName", PlayerStatController.getTotalStatsBySeasonPlayerApi);
api.get("/get-stats/:playerName", PlayerStatController.getStatsByPlayer);
api.get("/get-stats-match/:playerName", PlayerStatController.getStatsByPlayerAndMatch);
api.get("/get-stats-date/:playerName", PlayerStatController.getStatsByPlayerAndDate);
api.get("/get-stats-season/:season", PlayerStatController.getStatsBySeason);
api.put("/update-stats-name", [md_auth.ensureAdmin], PlayerStatController.updateStatDisplayName);
api.get("/add-stats/:team", [md_auth.ensureAdmin], PlayerStatController.getStatsData);
api.get("/add-stats-event/:event",[md_auth.ensureAdmin],PlayerStatController.addStatsEventData);
api.get("/get-stats-event/:event", PlayerStatController.getStatsEventData);
api.put("/update-stats-rebounds/:event",[md_auth.ensureAdmin], PlayerStatController.updateReboundsLocal);
api.get("/add-stats-event-playoff/:event", PlayerStatController.addStatsEventDataPlayoff);
api.get("/get-stats-event-playoff/:event", PlayerStatController.getStatsEventDataPlayoff);

module.exports = api;