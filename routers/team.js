const express = require("express");
const TeamController = require("../controllers/team");

const md_auth = require("../middleware/authenticate");


const api = express.Router();

api.get("/get-teams", TeamController.getTeams);
api.get("/get-team/:teamName", TeamController.getTeamByTeamId);



module.exports = api;