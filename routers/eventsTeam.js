const express = require("express");
const EventsTeamController = require("../controllers/eventsTeam");

const md_auth = require("../middleware/authenticate");


const api = express.Router();

api.get("/get-events-data/:team", [md_auth.ensureAdmin], EventsTeamController.getEventsTeamRegularData);
api.get("/get-events-data-2019/:team", [md_auth.ensureAdmin], EventsTeamController.getEventsTeamRegularSeason1920Data);
api.get("/get-events-playoffs-data-2019/:team", [md_auth.ensureAdmin], EventsTeamController.getEventsTeamPlayoffsSeason1920Data);

module.exports = api;