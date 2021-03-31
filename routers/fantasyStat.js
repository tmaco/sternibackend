const express = require("express");
const FantasyStatController = require("../controllers/fantasyStat");

const md_auth = require("../middleware/authenticate");


const api = express.Router();

api.get("/get-total-fantasy/:playerName", FantasyStatController.getTotalFantasyStatsByPlayer);
api.get("/get-season-fantasy/:playerName", FantasyStatController.getTotalFantasyStatsBySeasonPlayerApi);
api.get("/get-fantasy/:playerName", FantasyStatController.getFantasyStatsByPlayer);
api.get("/get-fantasy-league/:playerName", FantasyStatController.getFantasyStatsByLeague);
api.get("/get-fantasy-match/:playerName", FantasyStatController.getFantasyStatsByPlayerAndMatch);
api.get("/get-fantasy-date/:playerName", FantasyStatController.getFantasyStatsByPlayerAndDate);
api.get("/get-fantasy-season/:league", FantasyStatController.getFantasyStatsBySeason);
api.get("/get-fantasy-scoring/:player", FantasyStatController.getFantasyScoringByPlayer);
api.get("/get-fantasy-scoring-last/:player", FantasyStatController.getFantasyScoringLastGamesByPlayer);
api.get("/get-fantasy-event/:event", FantasyStatController.getFantasyScoringByEvent);
api.get("/get-fantasy-stats/:event", FantasyStatController.getFantasyStatsByEvent);
api.put("/update-fantasy-name", [md_auth.ensureAdmin], FantasyStatController.updateFantasyDisplayName);
api.post("/add-fantasy/:league", [md_auth.ensureAdmin], FantasyStatController.getFantasyStatsData);
api.post("/add-fantasy-event/:league", [md_auth.ensureAdmin], FantasyStatController.addFantasyStatsDataEvent);
api.get("/get-fstats-player/:playerId", FantasyStatController.getFantasyStatsByPlayerAndEventId);
api.get("/get-fstats/:playerId", FantasyStatController.getFantasyStatsPlayerByLeague);
api.get("/get-fstats-date/:playerId", FantasyStatController.getFantasyStatsPlayerByLeagueByDate);


module.exports = api;