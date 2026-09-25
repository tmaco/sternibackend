const express = require("express");
const EventsTeamController = require("../controllers/eventsTeam");

const md_auth = require("../middleware/authenticate");


const api = express.Router();

api.get("/get-events-data/:team", [md_auth.ensureAdmin], EventsTeamController.getEventsTeamRegularData);
api.get("/get-events-data-2019/:team", [md_auth.ensureAdmin], EventsTeamController.getEventsTeamRegularSeason1920Data);
api.get("/get-events-playoffs-data-2019/:team", [md_auth.ensureAdmin], EventsTeamController.getEventsTeamPlayoffsSeason1920Data);
api.get("/get-events-playoffs-data-2022/:team", [md_auth.ensureAdmin], EventsTeamController.getEventsTeamPlayoffsSeason2122Data);
api.get("/get-events-playoffs-data-2023/:team", [md_auth.ensureAdmin], EventsTeamController.getEventsTeamPlayoffsSeason2223Data);
api.get("/get-events-playoffs-data-2025/:team", [md_auth.ensureAdmin], EventsTeamController.getEventsTeamPlayoffsSeason2425Data);
api.get("/get-events-playoffs-data-2026/:team", [md_auth.ensureAdmin], EventsTeamController.getEventsTeamPlayoffsSeason2526Data);
api.get("/get-events-date", EventsTeamController.getEventsDate);
api.get("/get-home-events-date", EventsTeamController.getHomeEventsDate);
api.get("/get-events-date-team/:team", EventsTeamController.getEventsDateTeam);
api.get("/get-events-id-date", EventsTeamController.getEventsDateById);
api.put("/update-events-date", [md_auth.ensureAdmin], EventsTeamController.updateEventsDate);
api.put("/update-events-one-week", [md_auth.ensureAdmin], EventsTeamController.updateEventsDateOneWeek);
api.put("/update-events-date-playoff", [md_auth.ensureAdmin], EventsTeamController.updateEventsDatePlayoff);
api.get("/get-event/:eventId", EventsTeamController.getEvent);




module.exports = api;