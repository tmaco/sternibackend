const express = require("express");
const FantasyCalendarController = require("../controllers/fantasyCalendar");

const md_auth = require("../middleware/authenticate");

const api = express.Router();

api.get("/get-fantasy-calendar/", [md_auth.ensureAdmin], FantasyCalendarController.getFantasyCalendar);
api.post("/add-fantasy-calendar/", [md_auth.ensureAdmin], FantasyCalendarController.addFantasyCalendar);


module.exports = api;