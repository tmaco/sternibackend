const express = require("express");
const FantasyLeagueController = require("../controllers/fantasyLeague");

const md_auth = require("../middleware/authenticate");

const api = express.Router();

api.get("/get-fantasy-leagues", FantasyLeagueController.getTotalFantasyLeagues);
api.get("/get-fantasy-league-name/:league", FantasyLeagueController.getFantasyLeague);
api.post("/create-fantasy-league", [md_auth.ensureAuth], FantasyLeagueController.createFantasyLeague);
api.delete("/delete-fantasy-league/:league", [md_auth.ensureAdmin], FantasyLeagueController.deleteFantasyLeague);


module.exports = api;