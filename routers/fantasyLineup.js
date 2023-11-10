const express = require("express");
const FantasyLineupController = require("../controllers/fantasyLineup");

const md_auth = require("../middleware/authenticate");

const api = express.Router();

api.post("/add-lineup", [md_auth.ensureAuth], FantasyLineupController.addLineup);
api.post("/add-player-lineup/:id", [md_auth.ensureAuth], FantasyLineupController.addPlayerLineup);
api.get("/get-lineup", FantasyLineupController.getFantasyLineup);
api.get("/get-fantasy-lineup-id", FantasyLineupController.getFantasyLineupId);
api.get("/get-fantasy-league", FantasyLineupController.getFantasyLeagueId);
api.get("/get-fantasy-lineup-limit/:id", FantasyLineupController.getFantasyLineupLimit);
api.get("/get-fantasy-lineup", FantasyLineupController.getUserFantasyLineup);
api.get("/get-users-lineup", FantasyLineupController.getUsersFantasyLineups);
api.put("/update-lineup/:id", [md_auth.ensureAuth], FantasyLineupController.updateFantasyLineup);
api.delete("/delete-player-lineup/:id", [md_auth.ensureAuth], FantasyLineupController.deletePlayerFantasyLineup);
api.get("/get-scoring-lineup/:user",FantasyLineupController.getScoringLineupUser);
api.put("/update-scoring-lineup/:user", [md_auth.ensureAdmin], FantasyLineupController.updateScoringLineupUser);
api.put("/update-total-scoring/:id", [md_auth.ensureAdmin], FantasyLineupController.updateTotalScoringLineupUser);
api.get("/get-total-scoring-jornada",FantasyLineupController.getTotalScoringByJornada);
api.get("/get-total-scoring-lineup/:user",FantasyLineupController.getTotalScoringLineupByJornada);
api.get("/get-puntos-lineup/:user",FantasyLineupController.getPuntosLineupByJornada);
api.get("/get-total-scoring",FantasyLineupController.getTotalScoringByLeague);
api.get("/get-total-jornada",FantasyLineupController.getTotalScoringGroupByJornada);
api.get("/get-total-jornada-pos",FantasyLineupController.getTotalScoringGroupByJornadaPos);
api.get("/get-total-fantasy-scoring",FantasyLineupController.getTotalFantasyScoringByLeague);
api.put("/update-scoring-points/:user", [md_auth.ensureAdmin], FantasyLineupController.updateScoringPointsByJornada);
api.post("/save-all-lineups", [md_auth.ensureAdmin], FantasyLineupController.saveFantasyLineups);
api.put("/reset-scoring-lineup/:user", [md_auth.ensureAdmin], FantasyLineupController.resetScoringLineupUser);
api.put("/update-fantasy-team/:id", [md_auth.ensureAuth], FantasyLineupController.updateFantasyTeamName);

module.exports = api;