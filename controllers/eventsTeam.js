const utiles = require("../utils/normalizationNames");
const EventsTeam = require("../models/eventsTeam");
const FantasyCalendar = require("../models/fantasyCalendar");
const { log } = require("console");


function getEventsTeamRegularData(req,res){
    console.log(req.params.team);
    var TeamName = req.params.team;
    let team_id = TeamName;

    var MySportsFeeds = require("mysportsfeeds-node");

    var msf = new MySportsFeeds("2.1", true);
    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");
    msf.getData('nba', '2025-2026-regular', 'seasonal_games', 'json', {team: TeamName,  force: 'true', sort: 'game.starttime'})
    .then(async response => {
        const fs = require('fs');
        var path = require('path');

        var jsonPath = path.join(__dirname, '..', '.', 'results', 'seasonal_games-nba-2025-2026-regular.json');
        //var jsonPath = '/tmp/seasonal_games-nba-2023-2024-regular.json';


        await fs.readFile(jsonPath, (err, data) => {
            //fs.readFile(jsonPath, (err, data) => {
            if (err) throw err;
            let eventsData = JSON.parse(data);

            team_id = utiles.checkNewAPISportsFeeds(TeamName);

            console.log(utiles.count(eventsData.games));
            let numMatch=0;
            for(var i=0; i<utiles.count(eventsData.games); i++){
                var event = eventsData.games[i];
                numMatch++;

                var homeTeam= utiles.checkAbv(event.schedule.homeTeam.abbreviation);
                var awayTeam= utiles.checkAbv(event.schedule.awayTeam.abbreviation);
            
                var team_event_location_type = 'lol';
                if(team_id === homeTeam) {
                    team_event_location_type = 'h';
                } else if(team_id === awayTeam) {
                    team_event_location_type = 'a';
                }

                var team_points_scored = 0;
                var opponent_points_scored=0;
                var opponent_id="";

                if(team_event_location_type === 'h'){
                    team_points_scored = event.score.homeScoreTotal;
                    opponent_points_scored = event.score.awayScoreTotal;
                    opponent_id = awayTeam;
                } else if(team_event_location_type === 'a'){
                    team_points_scored = event.score.awayScoreTotal;
                    opponent_points_scored = event.score.homeScoreTotal;
                    opponent_id = homeTeam;
                }
                
                var team_event_result=null;
                if( team_points_scored > opponent_points_scored ){
                    team_event_result = "win";
                } else if (team_points_scored && opponent_points_scored){
                    team_event_result = "loss";
                }

                /*var eventTeam = new EventsTeam({
                    season_id: "22_23",
                    event_id: event.schedule.id,
                    event_status: event.schedule.playedStatus,
                    event_start_date_time: event.schedule.startTime,
                    event_season_type: "regular",
                    team_event_number_in_season: numMatch,
                    team_event_location_type: team_event_location_type,
                    team_event_result:  team_event_result,
                    team_points_scored: team_points_scored,
                    team_id: team_id, 
                    opponent_id: opponent_id , 
                    opponent_points_scored: opponent_points_scored

                });*/

                var eventTeam = new EventsTeam({
                    season_id: "25_26",
                    event_id: event.schedule.id,
                    event_status: event.schedule.playedStatus,
                    event_start_date_time: event.schedule.startTime,
                    event_season_type: "regular",
                    team_event_number_in_season: numMatch,
                    team_event_location_type: team_event_location_type,
                    team_id: team_id, 
                    opponent_id: opponent_id
                });

                //console.log(eventTeam);

                //EventsTeam.collection.updateOne({ event_id: eventTeam.event_id }, eventTeam, {upsert:true}, function (err, docs) {
                EventsTeam.collection.insertOne(eventTeam, function (err, docs) {
                    if (err){ 
                        console.warn("Duplicado");
                    } else {
                        //console.log(docs);
                    }
                });
            }
        });
    });
    
    res.status(200).jsonp({
        "status": 200,
        "message": `Events team ${team_id} inserted into Database`
      });	
}

function getEventsTeamRegularSeason1920Data(req,res){
    console.log(req.params.team);
    var TeamName = req.params.team;
    let team_id = TeamName;

    var MySportsFeeds = require("mysportsfeeds-node");

    var msf = new MySportsFeeds("2.1", true);
    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");
    msf.getData('nba', '2019-2020-regular', 'seasonal_games', 'json', {team: TeamName,  force: 'true', sort: 'game.starttime'})
    .then(async response => {
        const fs = require('fs');
        var path = require('path');

        var jsonPath = path.join(__dirname, '..', '.', 'results', 'seasonal_games-nba-2019-2020-regular.json');

        await fs.readFile(jsonPath, (err, data) => {
            if (err) throw err;
            let eventsData = JSON.parse(data);

            team_id = utiles.checkNewAPISportsFeeds(TeamName);

            console.log(utiles.count(eventsData.games));
            let numMatch=0;
            for(var i=0; i<utiles.count(eventsData.games); i++){
                var event = eventsData.games[i];
                numMatch++;

                var homeTeam= utiles.checkAbv(event.schedule.homeTeam.abbreviation);
                var awayTeam= utiles.checkAbv(event.schedule.awayTeam.abbreviation);
            
                var team_event_location_type = 'lol';
                if(team_id === homeTeam) {
                    team_event_location_type = 'h';
                } else if(team_id === awayTeam) {
                    team_event_location_type = 'a';
                }

                var team_points_scored = 0;
                var opponent_points_scored=0;
                var opponent_id="";

                if(team_event_location_type === 'h'){
                    team_points_scored = event.score.homeScoreTotal;
                    opponent_points_scored = event.score.awayScoreTotal;
                    opponent_id = awayTeam;
                } else if(team_event_location_type === 'a'){
                    team_points_scored = event.score.awayScoreTotal;
                    opponent_points_scored = event.score.homeScoreTotal;
                    opponent_id = homeTeam;
                }
                
                var team_event_result=null;
                if( team_points_scored > opponent_points_scored ){
                    team_event_result = "win";
                } else if (team_points_scored && opponent_points_scored){
                    team_event_result = "loss";
                }

                var eventTeam = new EventsTeam({
                    season_id: "19_20",
                    event_id: event.schedule.id,
                    event_status: event.schedule.playedStatus,
                    event_start_date_time: event.schedule.startTime,
                    event_season_type: "regular",
                    team_event_number_in_season: numMatch,
                    team_event_location_type: team_event_location_type,
                    team_event_result:  team_event_result,
                    team_points_scored: team_points_scored,
                    team_id: team_id, 
                    opponent_id: opponent_id , 
                    opponent_points_scored: opponent_points_scored

                });

                /*var eventTeam = new EventsTeam({
                    season_id: "20_21",
                    event_id: event.schedule.id,
                    event_status: event.schedule.playedStatus,
                    event_start_date_time: event.schedule.startTime,
                    event_season_type: "regular",
                    team_event_number_in_season: numMatch,
                    team_event_location_type: team_event_location_type,
                    team_id: team_id, 
                    opponent_id: opponent_id
                });*/

                //console.log(eventTeam);

                EventsTeam.collection.insert(eventTeam, function (err, docs) {
                    if (err){ 
                        return console.error(err);
                    } else {
                        //console.log("Event inserted to Collection");

                    }
                });
            }
        });
    });

    res.status(200).jsonp({
        "status": 200,
        "message": `Events team ${team_id} inserted into Database`
      });	
}

function getEventsTeamPlayoffsSeason1920Data(req,res){
    console.log(req.params.team);
    var TeamName = req.params.team;
    let team_id = TeamName;

    var MySportsFeeds = require("mysportsfeeds-node");

    var msf = new MySportsFeeds("2.1", true);
    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");
    msf.getData('nba', '2020-playoff', 'seasonal_games', 'json', {team: TeamName,  force: 'true', sort: 'game.starttime'})
    .then(async response => {
        const fs = require('fs');
        var path = require('path');

        var jsonPath = path.join(__dirname, '..', '.', 'results', 'seasonal_games-nba-2020-playoff.json');

        await fs.readFile(jsonPath, (err, data) => {
            if (err) throw err;
            let eventsData = JSON.parse(data);

            team_id = utiles.checkNewAPISportsFeeds(TeamName);

            console.log(utiles.count(eventsData.games));
            let numMatch=0;
            for(var i=0; i<utiles.count(eventsData.games); i++){
                var event = eventsData.games[i];
                numMatch++;

                var homeTeam= utiles.checkAbv(event.schedule.homeTeam.abbreviation);
                var awayTeam= utiles.checkAbv(event.schedule.awayTeam.abbreviation);
            
                var team_event_location_type = 'lol';
                if(team_id === homeTeam) {
                    team_event_location_type = 'h';
                } else if(team_id === awayTeam) {
                    team_event_location_type = 'a';
                }

                var team_points_scored = 0;
                var opponent_points_scored=0;
                var opponent_id="";

                if(team_event_location_type === 'h'){
                    team_points_scored = event.score.homeScoreTotal;
                    opponent_points_scored = event.score.awayScoreTotal;
                    opponent_id = awayTeam;
                } else if(team_event_location_type === 'a'){
                    team_points_scored = event.score.awayScoreTotal;
                    opponent_points_scored = event.score.homeScoreTotal;
                    opponent_id = homeTeam;
                }
                
                var team_event_result=null;
                if( team_points_scored > opponent_points_scored ){
                    team_event_result = "win";
                } else if (team_points_scored && opponent_points_scored){
                    team_event_result = "loss";
                }

                var eventTeam = new EventsTeam({
                    season_id: "19_20",
                    event_id: event.schedule.id,
                    event_status: event.schedule.playedStatus,
                    event_start_date_time: event.schedule.startTime,
                    event_season_type: "post",
                    team_event_number_in_season: numMatch,
                    team_event_location_type: team_event_location_type,
                    team_event_result:  team_event_result,
                    team_points_scored: team_points_scored,
                    team_id: team_id, 
                    opponent_id: opponent_id , 
                    opponent_points_scored: opponent_points_scored

                });

                /*var eventTeam = new EventsTeam({
                    season_id: "20_21",
                    event_id: event.schedule.id,
                    event_status: event.schedule.playedStatus,
                    event_start_date_time: event.schedule.startTime,
                    event_season_type: "regular",
                    team_event_number_in_season: numMatch,
                    team_event_location_type: team_event_location_type,
                    team_id: team_id, 
                    opponent_id: opponent_id
                });*/

                //console.log(eventTeam);

                EventsTeam.collection.insert(eventTeam, function (err, docs) {
                    if (err){ 
                        return console.error(err);
                    } else {
                        //console.log("Event inserted to Collection");

                    }
                });
            }
        });
    });

    res.status(200).jsonp({
        "status": 200,
        "message": `Events team ${team_id} inserted into Database`
      });	
}

function getEventsTeamPlayoffsSeason2122Data(req,res){
    console.log(req.params.team);
    var TeamName = req.params.team;
    let team_id = TeamName;

    var MySportsFeeds = require("mysportsfeeds-node");

   var msf = new MySportsFeeds("2.1", true);
    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");
    msf.getData('nba', '2022-playoff', 'seasonal_games', 'json', {team: TeamName, force: 'true', sort: 'game.starttime'})
    .then(async response => {
        const fs = require('fs');
        var path = require('path');

        var jsonPath = path.join(__dirname, '..', '.', 'results', 'seasonal_games-nba-2022-playoff.json');

        await fs.readFile(jsonPath, (err, data) => {
            //fs.readFile(jsonPath, (err, data) => {
            if (err) throw err;
            let eventsData = JSON.parse(data);

            team_id = utiles.checkNewAPISportsFeeds(TeamName);

            console.log(utiles.count(eventsData.games));
            let numMatch=0;
            for(var i=0; i<utiles.count(eventsData.games); i++){
                var event = eventsData.games[i];
                numMatch++;

                var homeTeam= utiles.checkAbv(event.schedule.homeTeam.abbreviation);
                var awayTeam= utiles.checkAbv(event.schedule.awayTeam.abbreviation);
            
                var team_event_location_type = 'lol';
                if(team_id === homeTeam) {
                    team_event_location_type = 'h';
                } else if(team_id === awayTeam) {
                    team_event_location_type = 'a';
                }

                var team_points_scored = 0;
                var opponent_points_scored=0;
                var opponent_id="";

                if(team_event_location_type === 'h'){
                    team_points_scored = event.score.homeScoreTotal;
                    opponent_points_scored = event.score.awayScoreTotal;
                    opponent_id = awayTeam;
                } else if(team_event_location_type === 'a'){
                    team_points_scored = event.score.awayScoreTotal;
                    opponent_points_scored = event.score.homeScoreTotal;
                    opponent_id = homeTeam;
                }
                
                var team_event_result=null;
                if( team_points_scored > opponent_points_scored ){
                    team_event_result = "win";
                } else if (team_points_scored && opponent_points_scored){
                    team_event_result = "loss";
                }

                var eventTeam = new EventsTeam({
                    season_id: "21_22",
                    event_id: event.schedule.id,
                    event_status: event.schedule.playedStatus,
                    event_start_date_time: event.schedule.startTime,
                    event_season_type: "post",
                    team_event_number_in_season: numMatch,
                    team_event_location_type: team_event_location_type,
                    team_event_result:  team_event_result,
                    team_points_scored: team_points_scored,
                    team_id: team_id, 
                    opponent_id: opponent_id , 
                    opponent_points_scored: opponent_points_scored

                });

                console.log(eventTeam);

                EventsTeam.collection.insertOne(eventTeam, function (err, docs) {
                    if (err){ 
                        return console.error(err);
                    } else {
                        //console.log("Event inserted to Collection");

                    }
                });
            }
        });
    });

    res.status(200).jsonp({
        "status": 200,
        "message": `Events team ${team_id} inserted into Database`
      });	
}

function getEventsTeamPlayoffsSeason2223Data(req,res){
    console.log(req.params.team);
    var TeamName = req.params.team;
    let team_id = TeamName;

    var MySportsFeeds = require("mysportsfeeds-node");

   var msf = new MySportsFeeds("2.1", true);
    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");
    msf.getData('nba', '2023-playoff', 'seasonal_games', 'json', {team: TeamName, force: 'true', sort: 'game.starttime'})
    .then(async response => {
        const fs = require('fs');
        var path = require('path');

        var jsonPath = path.join(__dirname, '..', '.', 'results', 'seasonal_games-nba-2023-playoff.json');

        await fs.readFile(jsonPath, (err, data) => {
            //fs.readFile(jsonPath, (err, data) => {
            if (err) throw err;
            let eventsData = JSON.parse(data);

            team_id = utiles.checkNewAPISportsFeeds(TeamName);

            console.log(utiles.count(eventsData.games));
            let numMatch=0;
            for(var i=0; i<utiles.count(eventsData.games); i++){
                var event = eventsData.games[i];
                numMatch++;

                var homeTeam= utiles.checkAbv(event.schedule.homeTeam.abbreviation);
                var awayTeam= utiles.checkAbv(event.schedule.awayTeam.abbreviation);
            
                var team_event_location_type = 'lol';
                if(team_id === homeTeam) {
                    team_event_location_type = 'h';
                } else if(team_id === awayTeam) {
                    team_event_location_type = 'a';
                }

                var team_points_scored = 0;
                var opponent_points_scored=0;
                var opponent_id="";

                if(team_event_location_type === 'h'){
                    team_points_scored = event.score.homeScoreTotal;
                    opponent_points_scored = event.score.awayScoreTotal;
                    opponent_id = awayTeam;
                } else if(team_event_location_type === 'a'){
                    team_points_scored = event.score.awayScoreTotal;
                    opponent_points_scored = event.score.homeScoreTotal;
                    opponent_id = homeTeam;
                }
                
                var team_event_result=null;
                if( team_points_scored > opponent_points_scored ){
                    team_event_result = "win";
                } else if (team_points_scored && opponent_points_scored){
                    team_event_result = "loss";
                }

                var eventTeam = new EventsTeam({
                    season_id: "22_23",
                    event_id: event.schedule.id,
                    event_status: event.schedule.playedStatus,
                    event_start_date_time: event.schedule.startTime,
                    event_season_type: "post",
                    team_event_number_in_season: numMatch,
                    team_event_location_type: team_event_location_type,
                    team_event_result:  team_event_result,
                    team_points_scored: team_points_scored,
                    team_id: team_id, 
                    opponent_id: opponent_id , 
                    opponent_points_scored: opponent_points_scored

                });

                //console.log(eventTeam);

                EventsTeam.collection.insertOne(eventTeam, function (err, docs) {
                    if (err){ 
                        return console.error(err);
                    } else {
                        //console.log("Event inserted to Collection");

                    }
                });
            }
        });
    });

    res.status(200).jsonp({
        "status": 200,
        "message": `Events team ${team_id} inserted into Database`
      });	
}

function getEventsDate(req,res){
    const dateFrom = req.query.from;
    const dateTo = req.query.to;

    EventsTeam.find({ event_start_date_time: {
        $gte: dateFrom,
        $lt: dateTo}})
        .sort({event_start_date_time: "asc"})
        .exec((err, eventsStored) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(eventsStored.length <= 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado eventos."});
                } else {
                    res.status(200).send({ code: 200, events: eventsStored });
                }
            }
        });
}

function getHomeEventsDate(req,res){
    const dateFrom = req.query.from;
    const dateTo = req.query.to;

    EventsTeam.find({ team_event_location_type : "h", event_start_date_time: {
        $gte: dateFrom,
        $lt: dateTo}})
        .sort({event_start_date_time: "asc"})
        .exec((err, eventsStored) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(eventsStored.length <= 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado eventos."});
                } else {
                    res.status(200).send({ code: 200, events: eventsStored });
                }
            }
        });
}

function getEventsDateTeam(req,res){
    const nameTeam = req.params.team;
    const dateFrom = req.query.from;
    var  dateTo = req.query.to;
    var eventStatus = req.query.status; 

    if (eventStatus === 'null') {
        eventStatus = null;
    }

    if (dateTo === 'null') {
        dateTo = null;
    }

    const query = {
        team_id: nameTeam,
        ...(eventStatus ? { event_status: eventStatus } : {}),
        ...(dateTo ? { event_start_date_time: { $gte: dateFrom, $lt: dateTo } } : 
            { event_start_date_time: { $gte: dateFrom } } 
        )
    };    
    
    EventsTeam.find(query)
        .sort({event_start_date_time: "asc"})
        .exec((err, eventsStored) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(eventsStored.length <= 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado eventos."});
                } else {
                    res.status(200).send({ code: 200, events: eventsStored });
                }
            }
        });
}

function getEventsDateById(req,res){
    const dateFrom = req.query.from;
    const dateTo = req.query.to;

    EventsTeam.aggregate([{$match: { event_start_date_time: {
                $gte: dateFrom,
                $lt: dateTo}
            }},
            { $group: { "_id": { event_id: "$event_id", event_start_date_time: "$event_start_date_time", event_status: "$event_status" },                           
            } },
            { $sort: { "_id.event_id": 1 } },
        ])
        .exec((err, eventsStored) => {
            console.log(eventsStored);
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(eventsStored.length <= 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado eventos."});
                } else {
                    res.status(200).send({ code: 200, events: eventsStored });
                }
            }
        });
}


/*function updateEventsDate(req,res){
    const dateFrom = req.query.from;
    const dateTo = req.query.to;

    var MySportsFeeds = require("mysportsfeeds-node");

    var msf = new MySportsFeeds("2.1", true);
    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");
    msf.getData('nba', '2025-2026-regular', 'seasonal_games', 'json', {date: 'from-yesterday-to-tomorrow', force: 'true', sort: 'game.starttime'})
    .then(async response => { //status: 'final',  
        const fs = require('fs');
        var path = require('path');
                
        var jsonPath = path.join(__dirname, '..', '.', 'results', 'seasonal_games-nba-2025-2026-regular-from-yesterday-to-tomorrow.json');
        //var jsonPath =  '/tmp/seasonal_games-nba-2023-2024-regular-from-yesterday-to-tomorrow.json';

                
        await fs.readFile(jsonPath, (err, data) => {
            if (err) throw err;
            let eventsData = JSON.parse(data);

            console.log(utiles.count(eventsData.games));
            for(var i=0; i<utiles.count(eventsData.games); i++){

                var event = eventsData.games[i];

                var homeTeam= utiles.checkAbv(event.schedule.homeTeam.abbreviation);
                var awayTeam= utiles.checkAbv(event.schedule.awayTeam.abbreviation);
                var playedStatus = event.schedule.playedStatus;

                var team_points_scored = event.score.homeScoreTotal;
                var opponent_points_scored = event.score.awayScoreTotal;
                    
                var team_event_result=null;
                if( team_points_scored > opponent_points_scored ){
                    team_event_result = "win";
                } else if (team_points_scored && opponent_points_scored){
                    team_event_result = "loss";
                }

                EventsTeam.updateOne({event_id: event.schedule.id, team_id: homeTeam},
                { season_id: "25_26", event_season_type: "regular", team_event_location_type: 'h', 
                    event_id: event.schedule.id, event_start_date_time: event.schedule.startTime,
                    team_id: homeTeam, opponent_id: awayTeam, team_event_result: team_points_scored > opponent_points_scored ? "win" : "loss", team_points_scored: team_points_scored, 
                    opponent_points_scored: opponent_points_scored, event_status: playedStatus },
                    {upsert:true})
                .exec((err, eventStored) => {
                    if(err){
                        res.status(500).send({ message: "Error del servidor."});
                    } else {
                        console.log(eventStored);
                        //res.status(200).send({ code: 200, fantasyCalendar: calendarStored });
                    }
                }); 

                var team_points_scored_away = event.score.awayScoreTotal;
                var opponent_points_scored_away = event.score.homeScoreTotal;

                if( team_points_scored > opponent_points_scored ){
                    team_event_result = "win";
                } else if (team_points_scored && opponent_points_scored){
                    team_event_result = "loss";
                }

                EventsTeam.updateOne({event_id: event.schedule.id, team_id: awayTeam},
                { season_id: "25_26", event_season_type: "regular", team_event_location_type: 'a', 
                    event_id: event.schedule.id, event_start_date_time: event.schedule.startTime,
                    team_id: awayTeam, opponent_id: homeTeam, team_event_result: team_points_scored_away > opponent_points_scored_away ? "win" : "loss", team_points_scored: team_points_scored_away, 
                    opponent_points_scored: opponent_points_scored_away, event_status: playedStatus},
                    {upsert:true})
                .exec((err, eventStored) => {
                    if(err){
                        res.status(500).send({ code: 500, message: "Error del servidor."});
                    } else {
                        console.log(eventStored);
                        //res.status(200).send({ code: 200, fantasyCalendar: calendarStored });
                    }
                }); 


            }
        });
    });

    res.status(200).send({ code: 200, message: "Events actualizados en la BD"});


}*/

function updateEventsDate(req, res) {
    const dateFrom = req.query.from;
    const dateTo = req.query.to;

    var MySportsFeeds = require("mysportsfeeds-node");
    var msf = new MySportsFeeds("2.1", true);
    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");
    
    msf.getData('nba', '2025-2026-regular', 'seasonal_games', 'json', { date: 'from-yesterday-to-tomorrow', force: 'true', sort: 'game.starttime' })
    .then(async (response) => { 
        const fs = require('fs');
        var path = require('path');
                
        var jsonPath = path.join(__dirname, '..', '.', 'results', 'seasonal_games-nba-2025-2026-regular-from-yesterday-to-tomorrow.json');
        
        await fs.readFile(jsonPath, (err, data) => {
            if (err) {
                return res.status(500).send({ message: "Error reading the file." });
            }

            let eventsData = JSON.parse(data);
            let updatePromises = []; // Store promises to ensure we handle all async operations

            console.log(utiles.count(eventsData.games));
            for (var i = 0; i < utiles.count(eventsData.games); i++) {
                var event = eventsData.games[i];

                var homeTeam = utiles.checkAbv(event.schedule.homeTeam.abbreviation);
                var awayTeam = utiles.checkAbv(event.schedule.awayTeam.abbreviation);
                var playedStatus = event.schedule.playedStatus;

                var team_points_scored = event.score.homeScoreTotal;
                var opponent_points_scored = event.score.awayScoreTotal;

                var team_event_result = null;
                if (team_points_scored > opponent_points_scored) {
                    team_event_result = "win";
                } else if (team_points_scored && opponent_points_scored) {
                    team_event_result = "loss";
                }

                // Create promises for each update
                updatePromises.push(EventsTeam.updateOne({ event_id: event.schedule.id, team_id: homeTeam },
                    {
                        season_id: "25_26", event_season_type: "regular", team_event_location_type: 'h',
                        event_id: event.schedule.id, event_start_date_time: event.schedule.startTime,
                        team_id: homeTeam, opponent_id: awayTeam, team_event_result: team_points_scored > opponent_points_scored ? "win" : "loss",
                        team_points_scored: team_points_scored, opponent_points_scored: opponent_points_scored, event_status: playedStatus
                    },
                    { upsert: true })
                );

                var team_points_scored_away = event.score.awayScoreTotal;
                var opponent_points_scored_away = event.score.homeScoreTotal;

                if (team_points_scored_away > opponent_points_scored_away) {
                    team_event_result = "win";
                } else if (team_points_scored_away && opponent_points_scored_away) {
                    team_event_result = "loss";
                }

                updatePromises.push(EventsTeam.updateOne({ event_id: event.schedule.id, team_id: awayTeam },
                    {
                        season_id: "25_26", event_season_type: "regular", team_event_location_type: 'a',
                        event_id: event.schedule.id, event_start_date_time: event.schedule.startTime,
                        team_id: awayTeam, opponent_id: homeTeam, team_event_result: team_points_scored_away > opponent_points_scored_away ? "win" : "loss",
                        team_points_scored: team_points_scored_away, opponent_points_scored: opponent_points_scored_away, event_status: playedStatus
                    },
                    { upsert: true })
                );
            }

            // Wait for all updates to finish
            Promise.all(updatePromises)
                .then((results) => {
                    console.log('All events updated successfully');
                    res.status(200).send({ code: 200, message: "Events actualizados en la BD" });
                })
                .catch((error) => {
                    console.error('Error updating events:', error);
                    res.status(500).send({ code: 500, message: "Error del servidor." });
                });
        });
    })
    .catch((error) => {
        console.error('Error fetching data from MySportsFeeds:', error);
        res.status(500).send({ code: 500, message: "Error al obtener los datos." });
    });
}

function updateEventsDateOneWeek(req, res) {
    const dateFrom = req.query.from;
    const dateTo = req.query.to;

    var MySportsFeeds = require("mysportsfeeds-node");
    var msf = new MySportsFeeds("2.1", true);
    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");
    
    msf.getData('nba', '2025-2026-regular', 'seasonal_games', 'json', { date: 'from-today-to-7-days-from-now', force: 'true', sort: 'game.starttime' })
    .then(async (response) => { 
        const fs = require('fs');
        var path = require('path');
                
        var jsonPath = path.join(__dirname, '..', '.', 'results', 'seasonal_games-nba-2025-2026-regular-from-today-to-7-days-from-now.json');
        
        await fs.readFile(jsonPath, (err, data) => {
            if (err) {
                return res.status(500).send({ message: "Error reading the file." });
            }

            let eventsData = JSON.parse(data);
            let updatePromises = []; // Store promises to ensure we handle all async operations

            console.log(utiles.count(eventsData.games));
            for (var i = 0; i < utiles.count(eventsData.games); i++) {
                var event = eventsData.games[i];

                var homeTeam = utiles.checkAbv(event.schedule.homeTeam.abbreviation);
                var awayTeam = utiles.checkAbv(event.schedule.awayTeam.abbreviation);
                var playedStatus = event.schedule.playedStatus;

                var team_points_scored = event.score.homeScoreTotal;
                var opponent_points_scored = event.score.awayScoreTotal;

                var team_event_result = null;
                if (team_points_scored > opponent_points_scored) {
                    team_event_result = "win";
                } else if (team_points_scored && opponent_points_scored) {
                    team_event_result = "loss";
                }

                // Create promises for each update
                updatePromises.push(EventsTeam.updateOne({ event_id: event.schedule.id, team_id: homeTeam },
                    {
                        season_id: "25_26", event_season_type: "regular", team_event_location_type: 'h',
                        event_id: event.schedule.id, event_start_date_time: event.schedule.startTime,
                        team_id: homeTeam, opponent_id: awayTeam, team_event_result: team_points_scored > opponent_points_scored ? "win" : "loss",
                        team_points_scored: team_points_scored, opponent_points_scored: opponent_points_scored, event_status: playedStatus
                    },
                    { upsert: true })
                );

                var team_points_scored_away = event.score.awayScoreTotal;
                var opponent_points_scored_away = event.score.homeScoreTotal;

                if (team_points_scored_away > opponent_points_scored_away) {
                    team_event_result = "win";
                } else if (team_points_scored_away && opponent_points_scored_away) {
                    team_event_result = "loss";
                }

                updatePromises.push(EventsTeam.updateOne({ event_id: event.schedule.id, team_id: awayTeam },
                    {
                        season_id: "25_26", event_season_type: "regular", team_event_location_type: 'a',
                        event_id: event.schedule.id, event_start_date_time: event.schedule.startTime,
                        team_id: awayTeam, opponent_id: homeTeam, team_event_result: team_points_scored_away > opponent_points_scored_away ? "win" : "loss",
                        team_points_scored: team_points_scored_away, opponent_points_scored: opponent_points_scored_away, event_status: playedStatus
                    },
                    { upsert: true })
                );
            }

            // Wait for all updates to finish
            Promise.all(updatePromises)
                .then((results) => {
                    console.log('All events updated successfully');
                    res.status(200).send({ code: 200, message: "Events actualizados en la BD" });
                })
                .catch((error) => {
                    console.error('Error updating events:', error);
                    res.status(500).send({ code: 500, message: "Error del servidor." });
                });
        });
    })
    .catch((error) => {
        console.error('Error fetching data from MySportsFeeds:', error);
        res.status(500).send({ code: 500, message: "Error al obtener los datos." });
    });
}

function updateEventsDatePlayoff(req,res){
    const dateFrom = req.query.from;
    const dateTo = req.query.to;

    var MySportsFeeds = require("mysportsfeeds-node");

    var msf = new MySportsFeeds("2.1", true);
    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");
    msf.getData('nba', '2024-playoff', 'seasonal_games', 'json', {date: 'from-20240415-to-20240619', force: 'false', sort: 'game.starttime'})
    .then(async response => { //status: 'final',  
        const fs = require('fs');
        var path = require('path');
                
        var jsonPath = path.join(__dirname, '..', '.', 'results', 'seasonal_games-nba-2024-playoff-from-20240415-to-20240619.json');
                
        await fs.readFile(jsonPath, (err, data) => {
            if (err) throw err;
            let eventsData = JSON.parse(data);

            console.log(utiles.count(eventsData.games));
            for(var i=0; i<utiles.count(eventsData.games); i++){

                var event = eventsData.games[i];

                var homeTeam= utiles.checkAbv(event.schedule.homeTeam.abbreviation);
                var awayTeam= utiles.checkAbv(event.schedule.awayTeam.abbreviation);
                var playedStatus = event.schedule.playedStatus;

                var team_points_scored = event.score.homeScoreTotal;
                var opponent_points_scored = event.score.awayScoreTotal;
                    
                var team_event_result=null;
                if( team_points_scored > opponent_points_scored ){
                    team_event_result = "win";
                } else if (team_points_scored < opponent_points_scored){
                    team_event_result = "loss";
                }

                EventsTeam.updateOne({event_id: event.schedule.id, team_id: homeTeam},
                { season_id: "23_24", event_season_type: "post", team_event_location_type: 'h', 
                    event_id: event.schedule.id, event_start_date_time: event.schedule.startTime,
                    team_id: homeTeam, opponent_id: awayTeam, team_event_result: team_points_scored > opponent_points_scored ? "win" : "loss", team_points_scored: team_points_scored, 
                    opponent_points_scored: opponent_points_scored, event_status: playedStatus },
                    {upsert:true})
                .exec((err, eventStored) => {
                    if(err){
                        res.status(500).send({ message: "Error del servidor."});
                    } else {
                        console.log(eventStored);
                        //res.status(200).send({ code: 200, fantasyCalendar: calendarStored });
                    }
                }); 

                var team_points_scored_away = event.score.awayScoreTotal;
                var opponent_points_scored_away = event.score.homeScoreTotal;

                if( team_points_scored_away > opponent_points_scored_away ){
                    team_event_result = "win";
                } else if (opponent_points_scored_away < team_points_scored_away){
                    team_event_result = "loss";
                }

                EventsTeam.updateOne({event_id: event.schedule.id, team_id: awayTeam},
                { season_id: "23_24", event_season_type: "post", team_event_location_type: 'a', 
                    event_id: event.schedule.id, event_start_date_time: event.schedule.startTime,
                    team_id: awayTeam, opponent_id: homeTeam, team_event_result: team_points_scored_away > opponent_points_scored_away ? "win" : "loss", team_points_scored: team_points_scored_away, 
                    opponent_points_scored: opponent_points_scored_away, event_status: playedStatus},
                    {upsert:true})
                .exec((err, eventStored) => {
                    if(err){
                        res.status(500).send({ code: 500, message: "Error del servidor."});
                    } else {
                        console.log(eventStored);
                        //res.status(200).send({ code: 200, fantasyCalendar: calendarStored });
                    }
                }); 


            }
        });
    });

    res.status(200).send({ code: 200, message: "Events Playoffs actualizados en la BD"});


}

function getEvent(req,res){
    const eventId = parseInt(req.params.eventId);
    const team = req.query.team;
    
    EventsTeam.findOne({ season_id: "20_21", event_id : eventId, team_id: team})
        .exec((err, eventStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(!eventStored) {
                    res.status(404).send({ message: "No se ha encontrado ningun evento con id " + eventId + "."});
                } else {
                    res.status(200).send({ code: 200, event: eventStored });
                }
            }
        });
}

module.exports = {
    getEventsTeamRegularData,
    getEventsTeamRegularSeason1920Data,
    getEventsTeamPlayoffsSeason1920Data,
    getEventsTeamPlayoffsSeason2122Data,
    getEventsTeamPlayoffsSeason2223Data,
    getEventsDate,
    getHomeEventsDate,
    getEventsDateTeam,
    updateEventsDate,
    getEventsDateById,
    getEvent,
    updateEventsDatePlayoff,
    updateEventsDateOneWeek
};