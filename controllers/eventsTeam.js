const utiles = require("../utils/normalizationNames");
const EventsTeam = require("../models/eventsTeam");
const FantasyCalendar = require("../models/fantasyCalendar");


function getEventsTeamRegularData(req,res){
    console.log(req.params.team);
    var TeamName = req.params.team;
    let team_id = TeamName;

    var MySportsFeeds = require("mysportsfeeds-node");

    var msf = new MySportsFeeds("2.1", true);
    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");
    msf.getData('nba', '2020-2021-regular', 'seasonal_games', 'json', {team: TeamName,  force: 'true', sort: 'game.starttime'})
    .then(async response => {
        const fs = require('fs');
        var path = require('path');

        var jsonPath = path.join(__dirname, '..', '.', 'results', 'seasonal_games-nba-2020-2021-regular.json');

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
                    season_id: "20_21",
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


function getEventsDate(req,res){
    const dateFrom = req.query.from;
    const dateTo = req.query.to;

    EventsTeam.find({ event_status: "COMPLETED", event_start_date_time: {
        $gte: dateFrom,
        $lt: dateTo}})
        .sort({event_id: "asc"})
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

function updateEventsDate(req,res){
    const dateFrom = req.query.from;
    const dateTo = req.query.to;

    var MySportsFeeds = require("mysportsfeeds-node");

    var msf = new MySportsFeeds("2.1", true);
    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");
    msf.getData('nba', '2020-2021-regular', 'seasonal_games', 'json', {status: 'final',  date: 'from-yesterday-to-tomorrow', force: 'true', sort: 'game.starttime'})
    .then(async response => {
        const fs = require('fs');
        var path = require('path');
                
        var jsonPath = path.join(__dirname, '..', '.', 'results', 'seasonal_games-nba-2020-2021-regular-from-yesterday-to-tomorrow.json');
                
        await fs.readFile(jsonPath, (err, data) => {
            if (err) throw err;
            let eventsData = JSON.parse(data);

            console.log(utiles.count(eventsData.games));
            for(var i=0; i<utiles.count(eventsData.games); i++){

                var event = eventsData.games[i];

                var homeTeam= utiles.checkAbv(event.schedule.homeTeam.abbreviation);
                var awayTeam= utiles.checkAbv(event.schedule.awayTeam.abbreviation);

                var team_points_scored = event.score.homeScoreTotal;
                var opponent_points_scored = event.score.awayScoreTotal;
                    
                var team_event_result=null;
                if( team_points_scored > opponent_points_scored ){
                    team_event_result = "win";
                } else if (team_points_scored && opponent_points_scored){
                    team_event_result = "loss";
                }

                EventsTeam.updateOne({event_id: event.schedule.id, team_id: homeTeam, event_status: 'UNPLAYED'},
                { $set: { team_event_result: team_event_result, team_points_scored: team_points_scored, 
                    opponent_points_scored: opponent_points_scored, event_status: 'COMPLETED' }})
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

                EventsTeam.updateOne({event_id: event.schedule.id, team_id: awayTeam, event_status: 'UNPLAYED'},
                { $set: { team_event_result: team_event_result, team_points_scored: team_points_scored_away, 
                    opponent_points_scored: opponent_points_scored_away, event_status: 'COMPLETED' }})
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


}

module.exports = {
    getEventsTeamRegularData,
    getEventsTeamRegularSeason1920Data,
    getEventsTeamPlayoffsSeason1920Data,
    getEventsDate,
    updateEventsDate,
    getEventsDateById
};