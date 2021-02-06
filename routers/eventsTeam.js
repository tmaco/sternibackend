const express = require("express");
const EventsTeamController = require("../controllers/eventsTeam");

const md_auth = require("../middleware/authenticate");


const api = express.Router();

api.get("/get-events-data/:team", [md_auth.ensureAdmin], EventsTeamController.getEventsTeamRegularData);
api.get("/get-events-data-2019/:team", [md_auth.ensureAdmin], EventsTeamController.getEventsTeamRegularSeason1920Data);
api.get("/get-events-playoffs-data-2019/:team", [md_auth.ensureAdmin], EventsTeamController.getEventsTeamPlayoffsSeason1920Data);
api.get("/get-events-date", [md_auth.ensureAdmin], EventsTeamController.getEventsDate);
api.get("/get-events-date-team/:team", [md_auth.ensureAdmin], EventsTeamController.getEventsDateTeam);
api.get("/get-events-id-date", [md_auth.ensureAdmin], EventsTeamController.getEventsDateById);
api.put("/update-events-date", [md_auth.ensureAdmin], EventsTeamController.updateEventsDate);
api.get("/get-event/:eventId", EventsTeamController.getEvent);




module.exports = api;