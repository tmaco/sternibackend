const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');

const app = express();
const { API_VERSION } = require('./config');

//Load routings
const userRoutes = require("./routers/user");
const authRoutes = require("./routers/auth");
const menuRoutes = require("./routers/menu");
const playerRoutes = require("./routers/player");
const teamRoutes = require("./routers/team");
const playerStatRoutes = require("./routers/playerStat");
const fantasyStatRoutes = require("./routers/fantasyStat");
const fantasyLineupRoutes = require("./routers/fantasyLineup");
const fantasyPlayersRoutes = require("./routers/fantasyPlayer");
const eventsTeamRoutes = require("./routers/eventsTeam");
const fantasyCalendarRoutes = require("./routers/fantasyCalendar");
const fantasyLeagueRoutes = require("./routers/fantasyLeague");
const registroRoutes = require("./routers/registro");
const postRoutes = require("./routers/post");
const statusPlayerRoutes = require("./routers/statusPlayer");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Configure Header HTTP
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

// Router Basic
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);
app.use(`/api/${API_VERSION}`, playerRoutes);
app.use(`/api/${API_VERSION}`, teamRoutes);
app.use(`/api/${API_VERSION}`, playerStatRoutes);
app.use(`/api/${API_VERSION}`, fantasyStatRoutes);
app.use(`/api/${API_VERSION}`, fantasyLineupRoutes);
app.use(`/api/${API_VERSION}`, fantasyPlayersRoutes);
app.use(`/api/${API_VERSION}`, eventsTeamRoutes);
app.use(`/api/${API_VERSION}`, fantasyCalendarRoutes);
app.use(`/api/${API_VERSION}`, fantasyLeagueRoutes);
app.use(`/api/${API_VERSION}`, registroRoutes);
app.use(`/api/${API_VERSION}`, postRoutes);
app.use(`/api/${API_VERSION}`, statusPlayerRoutes);

module.exports = app;