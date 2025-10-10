const PlayerStat = require("../models/playerStat");
const utiles = require("../utils/normalizationNames");
const EventsTeam = require("../models/eventsTeam");


function getTotalStatsByPlayer(req,res){
    const playerName = req.params.playerName;


    PlayerStat.find({ display_name: playerName,})
        .sort({ event_start_date_time: "asc"})
        .exec((err, statsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(statsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado estadisticas de " + playerName +"."});
                } else {
                    res.status(200).send({ code: 200, stats: statsStored });
                }
            }
        });

}

function getTotalStatsBySeasonPlayerApi(req,res){
    const playerName = req.params.playerName;
    const seasonId = req.query.season;


    PlayerStat.find({ season_id : seasonId, display_name: playerName,})
        .sort({ event_start_date_time: "asc"})
        .exec((err, statsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(statsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado estadisticas de " + playerName + " para la temporada " + seasonId+ "."});
                } else {
                    res.status(200).send({ code: 200, stats: statsStored });
                }
            }
        });

}

function getStatsByPlayer(req,res){
    const seasonId = req.query.season;
    const eventId = req.query.event;
    const playerName = req.params.playerName;


    PlayerStat.find({ season_id : seasonId, display_name: playerName, event_season_type: eventId})
        .sort({ event_start_date_time: "asc"})
        .exec((err, statsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(statsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado estadisticas de " + playerName 
                    + " del evento de tipo " + eventId + " para la temporada " + seasonId+ "."});
                } else {
                    res.status(200).send({ code: 200, stats: statsStored });
                }
            }
        });

}

function getStatsByPlayerAndMatch(req,res){
    const seasonId = req.query.season;
    const eventId = req.query.event;
    const matchId = req.query.match;
    const playerName = req.params.playerName;

    PlayerStat.findOne({ season_id : seasonId, display_name: playerName, event_season_type: eventId, 
        team_event_number_in_season: matchId})
        .exec((err, statsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if (!statsStored) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado estadisticas de " + 
                                            playerName + " del partido " + matchId + " del evento de tipo " 
                                            + eventId + " para la temporada " + seasonId+ "."});
                } else {
                    if(statsStored.length <= 0) {
                        res.status(404).send({ code: 404, message: "No se ha encontrado estadisticas de " + 
                                            playerName + " del partido " + matchId + " del evento de tipo " 
                                            + eventId + " para la temporada " + seasonId+ "."});
                    } else {
                        res.status(200).send({ code: 200, stats: statsStored });
                    }
                }
                
            }
        });

}

function getStatsByPlayerAndDate(req,res){
    const seasonId = req.query.season;
    const eventId = req.query.event;
    const matchId = req.query.match;
    const playerName = req.params.playerName;

    PlayerStat.findOne({ season_id : seasonId, display_name: playerName, event_season_type: eventId, 
        event_start_date_time: matchId})
        .exec((err, statsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if (!statsStored) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado estadisticas de " + 
                                            playerName + " del partido " + matchId + " del evento de tipo " 
                                            + eventId + " para la temporada " + seasonId+ "."});
                } else {
                    if(statsStored.length <= 0) {
                        res.status(404).send({ code: 404, message: "No se ha encontrado estadisticas de " + 
                                            playerName + " del partido " + matchId + " del evento de tipo " 
                                            + eventId + " para la temporada " + seasonId+ "."});
                    } else {
                        res.status(200).send({ code: 200, stats: statsStored });
                    }
                }
                
            }
        });

}

function getStatsBySeason(req,res){

    const seasonId = req.params.season;
    const eventID = req.query.event;


    PlayerStat.aggregate([{$match: { season_id: seasonId, event_season_type: eventID, seconds: { $gt: 0} }},
            { $group: { "_id": { player_id: "$player_id" , display_name: "$display_name", position:checkPosition("$position"),team_abbreviation:"$team_abbreviation" },
                "totalMatches" : { "$sum": 1},
                "totalMinutes" : { "$sum": "$minutes"},
                "totalSeconds" : { "$sum": "$seconds"},
                "totalPoints" : { "$sum": "$points"},
                "totalRebounds" : { "$sum": "$rebounds"} ,
                "totalDefRebounds" : { "$sum": "$defensive_rebounds"} ,
                "totalOfRebounds" : { "$sum": "$offensive_rebounds"} ,
                "totalAssists" : { "$sum": "$assists"} ,
                "totalSteals" : { "$sum": "$steals"} ,
                "totalBlocks" : { "$sum": "$blocks"} ,
                "totalTOs" : { "$sum": "$turnovers"} ,
                "totalFGMs" : { "$sum": "$field_goals_made"} ,
                "total3PTMs" : { "$sum": "$three_point_field_goals_made"} ,
                "totalFTMs" : { "$sum": "$free_throws_made"} ,
                "totalFGAs" : { "$sum": "$field_goals_attempted"} ,
                "total3PTAs" : { "$sum": "$three_point_field_goals_attempted"} ,
                "totalFTAs" : { "$sum": "$free_throws_attempted"} ,
                "totalFouls" : { "$sum": "$personal_fouls"} ,                
            } },
            { $sort: { "totalPoints": -1 } },
        ])
        .exec((err, statsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(statsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado estadisticas para la temporada " + seasonId +"."});
                } else {
                    res.status(200).send({ code: 200, stats: statsStored });
                }
            }
        });

}

function updateStatDisplayName(req,res) {
    PlayerStat.find({season_id: "19_20"})
        .sort({ team_id: "asc", uniform_number: "asc"})
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador."});
                } else {
                    for(var i=0; i<playersStored.length; i++){
                        PlayerStat.update({_id: playersStored[i].id },  { $set: {
                            last_name: utiles.removeDiacritics(playersStored[i].last_name), 
                            first_name: utiles.removeDiacritics(playersStored[i].first_name), 
                            display_name: utiles.removeDiacritics(playersStored[i].display_name),
                        } }, (err, statUpdate) => {
                            if(err) {
                                err.status(500).send({ message: "Error del servidor."});
                            } else {
                                if(!statUpdate) {
                                    err.status(404).send({ message: "Jugador no encontrado."});
                                } 
                            }
                        });
                        
                    }
                    res.status(200).send({ message: "Jugadores actualizados correctamente."});
                }
            }
        });
    
}

function getStatsData(req,res){
    var TeamName = req.params.team;
    const numMatch = req.query.number;
    const seasonId = req.query.season;
    const eventType = req.query.event;

    let team_id = TeamName;

    EventsTeam.findOne({team_id:team_id, team_event_number_in_season: numMatch, 
    season_id: seasonId, event_season_type: eventType, event_status: "COMPLETED"})
    .exec((err, eventsStored) => {
        if(err){
            res.status(500).send({ message: "Error del servidor."});
        } else {
            if (!eventsStored) {
                res.status(404).send({ code: 404, message: "No se ha encontrado eventos completados."});
            } else {
                if(eventsStored.length <= 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado eventos completados."});
                } else {
                    //res.status(200).send({ code: 200, events: eventsStored });
                    //console.log(eventsStored);
                            
                    var MySportsFeeds = require("mysportsfeeds-node");

                    var msf = new MySportsFeeds("2.1", true);
                    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");
                    msf.getData('nba', '2020-playoff', 'game_boxscore', 'json', {game: eventsStored.event_id,  force: 'false' })
                    .then(async response => {
                        const fs = require('fs');
                        var path = require('path');

                        var jsonPath = path.join(__dirname, '..', '.', 'results', `game_boxscore-nba-2020-playoff-${eventsStored.event_id}.json`);
                        await fs.readFile(jsonPath, (err, data) => {
                        //fs.readFile(jsonPath, (err, data) => {

                            if (err) throw err;
                            let statsDats = JSON.parse(data);

                            team_id = utiles.checkNewAPISportsFeeds(TeamName);
                            
                            var statAway = statsDats.stats.away;
                            var statHome = statsDats.stats.home;
                            var resultAway='';
					        var resultHome='';
                            if (statsDats.scoring.homeScoreTotal < statsDats.scoring.awayScoreTotal){
                                resultAway='win';
                                resultHome='lose'
                            }else if (statsDats.scoring.homeScoreTotal > statsDats.scoring.awayScoreTotal){
                                resultAway='lose';
                                resultHome='win'
                            }

                            if(eventsStored.team_event_location_type === 'a'){
                                console.log(numMatch +"-" +utiles.count(statAway.players));
                                for(var i=0; i<utiles.count(statAway.players); i++){
                                    //console.log(statAway.players[i].player.id);
                                    let playerStats = statAway.players[i].playerStats;
                                    let fieldGoals = playerStats[0].fieldGoals;
                                    let freeThrows= playerStats[0].freeThrows;
                                    let rebounds = playerStats[0].rebounds;
                                    let offense = playerStats[0].offense;
                                    let defense = playerStats[0].defense;
                                    let miscellaneous = playerStats[0].miscellaneous;

                                    var playerStatAway = new PlayerStat({
                                        player_id: statAway.players[i].player.id,
                                        season_id: seasonId, 
                                        team_id: eventsStored.team_id,
                                        last_name: utiles.removeDiacritics(statAway.players[i].player.lastName),
                                        first_name: utiles.removeDiacritics(statAway.players[i].player.firstName),
                                        display_name: utiles.removeDiacritics(statAway.players[i].player.firstName) + " " + utiles.removeDiacritics(statAway.players[i].player.lastName),
                                        team_abbreviation: utiles.checkTeam(eventsStored.team_id),
                                        opponent_id: eventsStored.opponent_id,
                                        position: statAway.players[i].player.position,
                                        seconds: miscellaneous.minSeconds,
                                        minutes: (miscellaneous.minSeconds === 0 ? 0 : (miscellaneous.minSeconds/60).toFixed(2)),
                                        points: offense.pts,
                                        assists: offense.ast,
                                        turnovers: defense.tov,
                                        steals: defense.stl,
                                        blocks: defense.blk,
                                        rebounds: rebounds.reb,
                                        field_goals_attempted: fieldGoals.fgAtt,
                                        field_goals_made: fieldGoals.fgMade,
                                        three_point_field_goals_attempted: fieldGoals.fg3PtAtt,
                                        three_point_field_goals_made: fieldGoals.fg3PtMade,
                                        free_throws_attempted: freeThrows.ftAtt,
                                        free_throws_made: freeThrows.ftMade,
                                        defensive_rebounds: rebounds.defReb,
                                        offensive_rebounds: rebounds.offReb,
                                        personal_fouls: miscellaneous.fouls,
                                        is_starter: ( miscellaneous.gamesStarted === 1 ? true: false),
                                        field_goal_percentage: fieldGoals.fgPct,
                                        three_point_percentage: fieldGoals.fg3PtPct,
                                        free_throw_percentage: freeThrows.ftPct,
                                        field_goal_percentage_string: fieldGoals.fgPct,
                                        three_point_field_goal_percentage_string: fieldGoals.fg3PtPct,
                                        free_throw_percentage_string: freeThrows.ftPct,
                                        event_id: eventsStored.event_id,
                                        event_start_date_time: eventsStored.event_start_date_time,
                                        event_season_type: eventsStored.event_season_type,
                                        team_event_location_type: 'a',
                                        team_event_result: resultAway,
                                        team_event_number_in_season: eventsStored.team_event_number_in_season                                });

                                    //console.log(playerStatAway);
                                    console.log("Player Stats AWAY to Collection: "+playerStatAway.team_id +" player: "+playerStatAway.display_name  +" game: "+ playerStatAway.team_event_number_in_season +" event: "+ playerStatAway.event_id);
                                    PlayerStat.collection.update({ player_id: playerStatAway.player_id, event_id: playerStatAway.event_id}, playerStatAway, {upsert:true}, function (err, docs) {
                                        if (err){ 
                                            console.warn("Duplicado");
                                        } else {
										   //console.log(docs);
                                        }
                                    });
                                }
                            } else if(eventsStored.team_event_location_type === 'h'){
                                console.log(numMatch +"-" +utiles.count(statHome.players));
                                for(var j=0; j<utiles.count(statHome.players); j++){
                                    //console.log(statHome.players[j].player.id);
                                    let playerStats = statHome.players[j].playerStats;
                                    let fieldGoals = playerStats[0].fieldGoals;
                                    let freeThrows= playerStats[0].freeThrows;
                                    let rebounds = playerStats[0].rebounds;
                                    let offense = playerStats[0].offense;
                                    let defense = playerStats[0].defense;
                                    let miscellaneous = playerStats[0].miscellaneous;
    
                                    var playerStatHome = new PlayerStat({
                                        player_id: statHome.players[j].player.id,
                                        season_id: seasonId, 
                                        team_id: eventsStored.team_id,
                                        last_name: utiles.removeDiacritics(statHome.players[j].player.lastName),
                                        first_name: utiles.removeDiacritics(statHome.players[j].player.firstName),
                                        display_name: utiles.removeDiacritics(statHome.players[j].player.firstName) + " " + utiles.removeDiacritics(statHome.players[j].player.lastName),
                                        team_abbreviation: utiles.checkTeam(eventsStored.team_id),
                                        opponent_id: eventsStored.opponent_id,
                                        position: statHome.players[j].player.position,
                                        seconds: miscellaneous.minSeconds,
                                        minutes: (miscellaneous.minSeconds === 0 ? 0 : (miscellaneous.minSeconds/60).toFixed(2)),
                                        points: offense.pts,
                                        assists: offense.ast,
                                        turnovers: defense.tov,
                                        steals: defense.stl,
                                        blocks: defense.blk,
                                        rebounds: rebounds.reb,
                                        field_goals_attempted: fieldGoals.fgAtt,
                                        field_goals_made: fieldGoals.fgMade,
                                        three_point_field_goals_attempted: fieldGoals.fg3PtAtt,
                                        three_point_field_goals_made: fieldGoals.fg3PtMade,
                                        free_throws_attempted: freeThrows.ftAtt,
                                        free_throws_made: freeThrows.ftMade,
                                        defensive_rebounds: rebounds.defReb,
                                        offensive_rebounds: rebounds.offReb,
                                        personal_fouls: miscellaneous.fouls,
                                        is_starter: ( miscellaneous.gamesStarted === 1 ? true: false),
                                        field_goal_percentage: fieldGoals.fgPct,
                                        three_point_percentage: fieldGoals.fg3PtPct,
                                        free_throw_percentage: freeThrows.ftPct,
                                        field_goal_percentage_string: fieldGoals.fgPct,
                                        three_point_field_goal_percentage_string: fieldGoals.fg3PtPct,
                                        free_throw_percentage_string: freeThrows.ftPct,
                                        event_id: eventsStored.event_id,
                                        event_start_date_time: eventsStored.event_start_date_time,
                                        event_season_type: eventsStored.event_season_type,
                                        team_event_location_type: 'h',
                                        team_event_result: resultHome,
                                        team_event_number_in_season: eventsStored.team_event_number_in_season                                });
    
                                    //console.log(playerStatHome);
                                    console.log("Player Stats HOME  to Collection: "+playerStatHome.team_id +" player: "+playerStatHome.display_name +" game: "+ playerStatHome.team_event_number_in_season +" event: "+ playerStatHome.event_id);
                                    PlayerStat.collection.update({ player_id: playerStatHome.player_id, event_id: playerStatHome.event_id}, playerStatHome, {upsert:true}, function (err, docs) {
                                        if (err){ 
                                            console.warn("Duplicado");
                                        } else {
										   //console.log(docs);
                                        }
                                    });
                                }

                            }
                        });
                    });
                    res.status(200).jsonp({
                        "status": 200,
                        "message": `Stats ${team_id} match ${numMatch} inserted into Database`
                      });
                    
                }
            }
            
        }
        
    });    	
}

function getStatsEventData(req,res){
    const eventID = req.params.event;
    const eventLocation= req.query.location;
        
    EventsTeam.findOne({ event_id: parseInt(eventID), team_event_location_type: eventLocation, event_status: "COMPLETED"})
    .exec((err, eventsStored) => {
        if(err){
            res.status(500).send({ message: "Error del servidor."});
        } else {
            if (!eventsStored) {
                res.status(404).send({ code: 404, message: "No se ha encontrado eventos completados: "+ eventID});
            } else {
                if(eventsStored.length <= 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado eventos completados: "+eventID});
                } else {
                    var MySportsFeeds = require("mysportsfeeds-node");
    
                    var msf = new MySportsFeeds("2.1", true);
                    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");

                    var event = eventsStored;
                    const fs = require('fs');
                    var path = require('path');
    
                    var jsonPath = path.join(__dirname, '..', '.', 'results', `game_boxscore-nba-2025-2026-regular-${event.event_id}.json`);
                    msf.getData('nba', '2025-2026-regular', 'game_boxscore', 'json', {game: event.event_id,  force: 'true' });
                    res.status(200).send({ code: 200, message: "Fichero de estadísticas generado - "+ eventID});

                }
            }
        }
            
    });    	
}

function addStatsEventData(req,res){
    const eventID = req.params.event;
    const eventLocation= req.query.location;
        
    EventsTeam.findOne({ event_id: parseInt(eventID), team_event_location_type: eventLocation, event_status: "COMPLETED"})
    .exec((err, eventsStored) => {
        if(err){
            res.status(500).send({ message: "Error del servidor."});
        } else {
            if (!eventsStored) {
                res.status(404).send({ code: 404, message: "No se ha encontrado eventos completados: "+ eventID});
            } else {
                if(eventsStored.length <= 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado eventos completados: "+eventID});
                } else {
                    //res.status(200).send({ code: 200, events: eventsStored });
                    var MySportsFeeds = require("mysportsfeeds-node");
    
                    var msf = new MySportsFeeds("2.1", true);
                    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");

                    var event = eventsStored;
                    const fs = require('fs');
                    var path = require('path');
    
                    var jsonPath = path.join(__dirname, '..', '.', 'results', `game_boxscore-nba-2025-2026-regular-${event.event_id}.json`);
                    //var jsonPath = `/tmp/game_boxscore-nba-2023-2024-regular-${event.event_id}.json`;

                    if (fs.existsSync(jsonPath)) {
                        console.log("FILE existsSync!!!");
                        fs.readFile(jsonPath, (err, data) => {
            
                                if (err) throw err;

                                let statsDats = JSON.parse(data);

                                if(statsDats.game.playedStatus === "COMPLETED"){

                                    var statAway = statsDats.stats.away;
                                    var statHome = statsDats.stats.home;
                                    var resultAway='';
                                    var resultHome='';
                                    if (statsDats.scoring.homeScoreTotal < statsDats.scoring.awayScoreTotal){
                                        resultAway='win';
                                        resultHome='lose'
                                    }else if (statsDats.scoring.homeScoreTotal > statsDats.scoring.awayScoreTotal){
                                        resultAway='lose';
                                        resultHome='win'
                                    }
                                        
                                    if(event.team_event_location_type === 'a'){
                                        console.log(utiles.count(statAway.players));
                                        for(var i=0; i<utiles.count(statAway.players); i++){
                                            let playerStats = statAway.players[i].playerStats;
                                            let fieldGoals = playerStats[0].fieldGoals;
                                            let freeThrows= playerStats[0].freeThrows;
                                            let rebounds = playerStats[0].rebounds;
                                            let offense = playerStats[0].offense;
                                            let defense = playerStats[0].defense;
                                            let miscellaneous = playerStats[0].miscellaneous;
                
                                            var playerStatAway = new PlayerStat({
                                                player_id: statAway.players[i].player.id,
                                                season_id: event.season_id, 
                                                team_id: event.team_id,
                                                last_name: utiles.removeDiacritics(statAway.players[i].player.lastName),
                                                first_name: utiles.removeDiacritics(statAway.players[i].player.firstName),
                                                display_name: utiles.removeDiacritics(statAway.players[i].player.firstName) + " " + utiles.removeDiacritics(statAway.players[i].player.lastName),
                                                team_abbreviation: utiles.checkTeam(event.team_id),
                                                opponent_id: event.opponent_id,
                                                position: statAway.players[i].player.position,
                                                seconds: miscellaneous.minSeconds,
                                                minutes: (miscellaneous.minSeconds === 0 ? 0 : (miscellaneous.minSeconds/60).toFixed(2)),
                                                points: offense.pts,
                                                assists: offense.ast,
                                                turnovers: defense.tov,
                                                steals: defense.stl,
                                                blocks: defense.blk,
                                                rebounds: rebounds.reb,
                                                field_goals_attempted: fieldGoals.fgAtt,
                                                field_goals_made: fieldGoals.fgMade,
                                                three_point_field_goals_attempted: fieldGoals.fg3PtAtt,
                                                three_point_field_goals_made: fieldGoals.fg3PtMade,
                                                free_throws_attempted: freeThrows.ftAtt,
                                                free_throws_made: freeThrows.ftMade,
                                                defensive_rebounds: rebounds.defReb,
                                                offensive_rebounds: rebounds.offReb,
                                                personal_fouls: miscellaneous.fouls,
                                                is_starter: ( miscellaneous.gamesStarted === 1 ? true: false),
                                                field_goal_percentage: fieldGoals.fgPct,
                                                three_point_percentage: fieldGoals.fg3PtPct,
                                                free_throw_percentage: freeThrows.ftPct,
                                                field_goal_percentage_string: fieldGoals.fgPct,
                                                three_point_field_goal_percentage_string: fieldGoals.fg3PtPct,
                                                free_throw_percentage_string: freeThrows.ftPct,
                                                event_id: event.event_id,
                                                event_start_date_time: event.event_start_date_time,
                                                event_season_type: event.event_season_type,
                                                team_event_location_type: 'a',
                                                team_event_result: resultAway,
                                                team_event_number_in_season: event.team_event_number_in_season                                
                                            });
                
                                            //console.log(playerStatAway);
                                            console.log("Player Stats AWAY to Collection: "+playerStatAway.team_id +" player: "+playerStatAway.display_name  +" game: "+ playerStatAway.team_event_number_in_season +" event: "+ playerStatAway.event_id);
                                            //utiles.sleepFor(1000);
                                            PlayerStat.collection.update({ player_id: playerStatAway.player_id, event_id: playerStatAway.event_id}, playerStatAway, {upsert:true}, function (err, docs) {
                                            //PlayerStat.collection.insertOne(playerStatAway, function (err, docs) {

                                                if (err){ 
                                                    console.warn("Duplicado");
                                                } else {
                                                    //console.log(docs);
                                                }
                                            });
                                        }
                                    } else if(event.team_event_location_type === 'h'){
                                        console.log(utiles.count(statHome.players));
                                        for(var j=0; j<utiles.count(statHome.players); j++){
                                            let playerStats = statHome.players[j].playerStats;
                                            let fieldGoals = playerStats[0].fieldGoals;
                                            let freeThrows= playerStats[0].freeThrows;
                                            let rebounds = playerStats[0].rebounds;
                                            let offense = playerStats[0].offense;
                                            let defense = playerStats[0].defense;
                                            let miscellaneous = playerStats[0].miscellaneous;
                    
                                            var playerStatHome = new PlayerStat({
                                                player_id: statHome.players[j].player.id,
                                                season_id: event.season_id, 
                                                team_id: event.team_id,
                                                last_name: utiles.removeDiacritics(statHome.players[j].player.lastName),
                                                first_name: utiles.removeDiacritics(statHome.players[j].player.firstName),
                                                display_name: utiles.removeDiacritics(statHome.players[j].player.firstName) + " " + utiles.removeDiacritics(statHome.players[j].player.lastName),
                                                team_abbreviation: utiles.checkTeam(event.team_id),
                                                opponent_id: event.opponent_id,
                                                position: statHome.players[j].player.position,
                                                seconds: miscellaneous.minSeconds,
                                                minutes: (miscellaneous.minSeconds === 0 ? 0 : (miscellaneous.minSeconds/60).toFixed(2)),
                                                points: offense.pts,
                                                assists: offense.ast,
                                                turnovers: defense.tov,
                                                steals: defense.stl,
                                                blocks: defense.blk,
                                                rebounds: rebounds.reb,
                                                field_goals_attempted: fieldGoals.fgAtt,
                                                field_goals_made: fieldGoals.fgMade,
                                                three_point_field_goals_attempted: fieldGoals.fg3PtAtt,
                                                three_point_field_goals_made: fieldGoals.fg3PtMade,
                                                free_throws_attempted: freeThrows.ftAtt,
                                                free_throws_made: freeThrows.ftMade,
                                                defensive_rebounds: rebounds.defReb,
                                                offensive_rebounds: rebounds.offReb,
                                                personal_fouls: miscellaneous.fouls,
                                                is_starter: ( miscellaneous.gamesStarted === 1 ? true: false),
                                                field_goal_percentage: fieldGoals.fgPct,
                                                three_point_percentage: fieldGoals.fg3PtPct,
                                                free_throw_percentage: freeThrows.ftPct,
                                                field_goal_percentage_string: fieldGoals.fgPct,
                                                three_point_field_goal_percentage_string: fieldGoals.fg3PtPct,
                                                free_throw_percentage_string: freeThrows.ftPct,
                                                event_id: event.event_id,
                                                event_start_date_time: event.event_start_date_time,
                                                event_season_type: event.event_season_type,
                                                team_event_location_type: 'h',
                                                team_event_result: resultHome,
                                                team_event_number_in_season: event.team_event_number_in_season                                
                                            });
                    
                                            //console.log(playerStatHome);
                                            console.log("Player Stats HOME  to Collection: "+playerStatHome.team_id +" player: "+playerStatHome.display_name +" game: "+ playerStatHome.team_event_number_in_season +" event: "+ playerStatHome.event_id);
                                            //utiles.sleepFor(1000);
                                            PlayerStat.collection.update({ player_id: playerStatHome.player_id, event_id: playerStatHome.event_id}, playerStatHome, {upsert:true}, function (err, docs) {
                                            //PlayerStat.collection.insertOne(playerStatHome, function (err, docs) {

                                                if (err){ 
                                                    console.warn("Duplicado");
                                                } else {
                                                   // console.log(docs);
                                                }
                                            });
                                        }
                
                                    }

                                } else {
                                    console.log(statsDats.game.playedStatus);

                                }
                        });
                        //});
                        
                    } else{
                        console.log("FILE NOT!!! existsSync");
                        msf.getData('nba', '2025-2026-regular', 'game_boxscore', 'json', {game: event.event_id,  force: 'true' })
                        .then( async response => {
                            await fs.readFile(jsonPath, (err, data) => {
                            //fs.readFile(jsonPath, (err, data) => {
            
                                if (err) throw err;
                                let statsDats = JSON.parse(data);

                                if(statsDats.game.playedStatus === "COMPLETED"){
                                    var statAway = statsDats.stats.away;
                                    var statHome = statsDats.stats.home;
                                    var resultAway='';
                                    var resultHome='';
                                    if (statsDats.scoring.homeScoreTotal < statsDats.scoring.awayScoreTotal){
                                        resultAway='win';
                                        resultHome='lose'
                                    }else if (statsDats.scoring.homeScoreTotal > statsDats.scoring.awayScoreTotal){
                                        resultAway='lose';
                                        resultHome='win'
                                    }
                                        
                                    if(event.team_event_location_type === 'a'){
                                        console.log(utiles.count(statAway.players));
                                        for(var i=0; i<utiles.count(statAway.players); i++){
                                            let playerStats = statAway.players[i].playerStats;
                                            let fieldGoals = playerStats[0].fieldGoals;
                                            let freeThrows= playerStats[0].freeThrows;
                                            let rebounds = playerStats[0].rebounds;
                                            let offense = playerStats[0].offense;
                                            let defense = playerStats[0].defense;
                                            let miscellaneous = playerStats[0].miscellaneous;
                
                                            var playerStatAway = new PlayerStat({
                                                player_id: statAway.players[i].player.id,
                                                season_id: event.season_id, 
                                                team_id: event.team_id,
                                                last_name: utiles.removeDiacritics(statAway.players[i].player.lastName),
                                                first_name: utiles.removeDiacritics(statAway.players[i].player.firstName),
                                                display_name: utiles.removeDiacritics(statAway.players[i].player.firstName) + " " + utiles.removeDiacritics(statAway.players[i].player.lastName),
                                                team_abbreviation: utiles.checkTeam(event.team_id),
                                                opponent_id: event.opponent_id,
                                                position: statAway.players[i].player.position,
                                                seconds: miscellaneous.minSeconds,
                                                minutes: (miscellaneous.minSeconds === 0 ? 0 : (miscellaneous.minSeconds/60).toFixed(2)),
                                                points: offense.pts,
                                                assists: offense.ast,
                                                turnovers: defense.tov,
                                                steals: defense.stl,
                                                blocks: defense.blk,
                                                rebounds: rebounds.reb,
                                                field_goals_attempted: fieldGoals.fgAtt,
                                                field_goals_made: fieldGoals.fgMade,
                                                three_point_field_goals_attempted: fieldGoals.fg3PtAtt,
                                                three_point_field_goals_made: fieldGoals.fg3PtMade,
                                                free_throws_attempted: freeThrows.ftAtt,
                                                free_throws_made: freeThrows.ftMade,
                                                defensive_rebounds: rebounds.defReb,
                                                offensive_rebounds: rebounds.offReb,
                                                personal_fouls: miscellaneous.fouls,
                                                is_starter: ( miscellaneous.gamesStarted === 1 ? true: false),
                                                field_goal_percentage: fieldGoals.fgPct,
                                                three_point_percentage: fieldGoals.fg3PtPct,
                                                free_throw_percentage: freeThrows.ftPct,
                                                field_goal_percentage_string: fieldGoals.fgPct,
                                                three_point_field_goal_percentage_string: fieldGoals.fg3PtPct,
                                                free_throw_percentage_string: freeThrows.ftPct,
                                                event_id: event.event_id,
                                                event_start_date_time: event.event_start_date_time,
                                                event_season_type: event.event_season_type,
                                                team_event_location_type: 'a',
                                                team_event_result: resultAway,
                                                team_event_number_in_season: event.team_event_number_in_season                                
                                            });
                
                                            //console.log(playerStatAway);
                                            console.log("Player Stats AWAY to Collection: "+playerStatAway.team_id +" player: "+playerStatAway.display_name  +" game: "+ playerStatAway.team_event_number_in_season +" event: "+ playerStatAway.event_id);
                                            //utiles.sleepFor(1000);
                                            PlayerStat.collection.update({ player_id: playerStatAway.player_id, event_id: playerStatAway.event_id}, playerStatAway, {upsert:true}, function (err, docs) {
                                                if (err){ 
                                                    console.warn("Duplicado");
                                                } else {
                                                    //console.log(docs);
                                                }
                                            });
                                        }
                                    } else if(event.team_event_location_type === 'h'){
                                        console.log(utiles.count(statHome.players));
                                        for(var j=0; j<utiles.count(statHome.players); j++){
                                            let playerStats = statHome.players[j].playerStats;
                                            let fieldGoals = playerStats[0].fieldGoals;
                                            let freeThrows= playerStats[0].freeThrows;
                                            let rebounds = playerStats[0].rebounds;
                                            let offense = playerStats[0].offense;
                                            let defense = playerStats[0].defense;
                                            let miscellaneous = playerStats[0].miscellaneous;
                    
                                            var playerStatHome = new PlayerStat({
                                                player_id: statHome.players[j].player.id,
                                                season_id: event.season_id, 
                                                team_id: event.team_id,
                                                last_name: utiles.removeDiacritics(statHome.players[j].player.lastName),
                                                first_name: utiles.removeDiacritics(statHome.players[j].player.firstName),
                                                display_name: utiles.removeDiacritics(statHome.players[j].player.firstName) + " " + utiles.removeDiacritics(statHome.players[j].player.lastName),
                                                team_abbreviation: utiles.checkTeam(event.team_id),
                                                opponent_id: event.opponent_id,
                                                position: statHome.players[j].player.position,
                                                seconds: miscellaneous.minSeconds,
                                                minutes: (miscellaneous.minSeconds === 0 ? 0 : (miscellaneous.minSeconds/60).toFixed(2)),
                                                points: offense.pts,
                                                assists: offense.ast,
                                                turnovers: defense.tov,
                                                steals: defense.stl,
                                                blocks: defense.blk,
                                                rebounds: rebounds.reb,
                                                field_goals_attempted: fieldGoals.fgAtt,
                                                field_goals_made: fieldGoals.fgMade,
                                                three_point_field_goals_attempted: fieldGoals.fg3PtAtt,
                                                three_point_field_goals_made: fieldGoals.fg3PtMade,
                                                free_throws_attempted: freeThrows.ftAtt,
                                                free_throws_made: freeThrows.ftMade,
                                                defensive_rebounds: rebounds.defReb,
                                                offensive_rebounds: rebounds.offReb,
                                                personal_fouls: miscellaneous.fouls,
                                                is_starter: ( miscellaneous.gamesStarted === 1 ? true: false),
                                                field_goal_percentage: fieldGoals.fgPct,
                                                three_point_percentage: fieldGoals.fg3PtPct,
                                                free_throw_percentage: freeThrows.ftPct,
                                                field_goal_percentage_string: fieldGoals.fgPct,
                                                three_point_field_goal_percentage_string: fieldGoals.fg3PtPct,
                                                free_throw_percentage_string: freeThrows.ftPct,
                                                event_id: event.event_id,
                                                event_start_date_time: event.event_start_date_time,
                                                event_season_type: event.event_season_type,
                                                team_event_location_type: 'h',
                                                team_event_result: resultHome,
                                                team_event_number_in_season: event.team_event_number_in_season                                
                                            });
                    
                                            //console.log(playerStatHome);
                                            console.log("Player Stats HOME  to Collection: "+playerStatHome.team_id +" player: "+playerStatHome.display_name +" game: "+ playerStatHome.team_event_number_in_season +" event: "+ playerStatHome.event_id);
                                            //utiles.sleepFor(1000);
                                            PlayerStat.collection.update({ player_id: playerStatHome.player_id, event_id: playerStatHome.event_id}, playerStatHome, {upsert:true}, function (err, docs) {
                                                if (err){ 
                                                    console.warn("Duplicado");
                                                } else {
                                                    //console.log(docs);
                                                }
                                            });
                                        }
                
                                    }

                                } else {
                                    console.log(statsDats.game.playedStatus);

                                }
                            });
                        });

                    }
                    
                }
                utiles.sleepFor(5000);	
                res.status(200).send({ code: 200, message: "Player Stats actualizadas en la BD - "+ eventID + "-"+eventLocation});

                        
            }
        }
            
    });    	
}

function getStatsEventDataPlayoff(req,res){
    const eventID = req.params.event;
    const eventLocation= req.query.location;
        
    EventsTeam.findOne({ event_id: parseInt(eventID), team_event_location_type: eventLocation, event_status: "COMPLETED"})
    .exec((err, eventsStored) => {
        if(err){
            res.status(500).send({ message: "Error del servidor."});
        } else {
            if (!eventsStored) {
                res.status(404).send({ code: 404, message: "No se ha encontrado eventos completados: "+ eventID});
            } else {
                if(eventsStored.length <= 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado eventos completados: "+eventID});
                } else {
                    var MySportsFeeds = require("mysportsfeeds-node");
    
                    var msf = new MySportsFeeds("2.1", true);
                    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");

                    var event = eventsStored;
                    const fs = require('fs');
                    var path = require('path');
    
                    var jsonPath = path.join(__dirname, '..', '.', 'results', `game_boxscore-nba-2025-playoff-${event.event_id}.json`);
                    msf.getData('nba', '2025-playoff', 'game_boxscore', 'json', {game: event.event_id,  force: 'false' });
                    res.status(200).send({ code: 200, message: "Fichero de estadísticas generado - "+ eventID});

                }
            }
        }
            
    });    	
}

function addStatsEventDataPlayoff(req,res){
    const eventID = req.params.event;
    const eventLocation= req.query.location;
        
    EventsTeam.findOne({ event_id: parseInt(eventID), team_event_location_type: eventLocation, event_status: "COMPLETED"})
    .exec((err, eventsStored) => {
        if(err){
            res.status(500).send({ message: "Error del servidor."});
        } else {
            if (!eventsStored) {
                res.status(404).send({ code: 404, message: "No se ha encontrado eventos completados: "+ eventID});
            } else {
                if(eventsStored.length <= 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado eventos completados: "+eventID});
                } else {
                    //res.status(200).send({ code: 200, events: eventsStored });
                    var MySportsFeeds = require("mysportsfeeds-node");
    
                    var msf = new MySportsFeeds("2.1", true);
                    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");

                    var event = eventsStored;
                    const fs = require('fs');
                    var path = require('path');
    
                    var jsonPath = path.join(__dirname, '..', '.', 'results', `game_boxscore-nba-2025-playoff-${event.event_id}.json`);
                    if (fs.existsSync(jsonPath)) {
                        console.log("FILE existsSync!!!");
                        fs.readFile(jsonPath, (err, data) => {
            
                                if (err) throw err;

                                let statsDats = JSON.parse(data);

                                if(statsDats.game.playedStatus === "COMPLETED"){

                                    var statAway = statsDats.stats.away;
                                    var statHome = statsDats.stats.home;
                                    var resultAway='';
                                    var resultHome='';
                                    if (statsDats.scoring.homeScoreTotal < statsDats.scoring.awayScoreTotal){
                                        resultAway='win';
                                        resultHome='lose'
                                    }else if (statsDats.scoring.homeScoreTotal > statsDats.scoring.awayScoreTotal){
                                        resultAway='lose';
                                        resultHome='win'
                                    }
                                        
                                    if(event.team_event_location_type === 'a'){
                                        console.log(utiles.count(statAway.players));
                                        for(var i=0; i<utiles.count(statAway.players); i++){
                                            let playerStats = statAway.players[i].playerStats;
                                            let fieldGoals = playerStats[0].fieldGoals;
                                            let freeThrows= playerStats[0].freeThrows;
                                            let rebounds = playerStats[0].rebounds;
                                            let offense = playerStats[0].offense;
                                            let defense = playerStats[0].defense;
                                            let miscellaneous = playerStats[0].miscellaneous;
                
                                            var playerStatAway = new PlayerStat({
                                                player_id: statAway.players[i].player.id,
                                                season_id: event.season_id, 
                                                team_id: event.team_id,
                                                last_name: utiles.removeDiacritics(statAway.players[i].player.lastName),
                                                first_name: utiles.removeDiacritics(statAway.players[i].player.firstName),
                                                display_name: utiles.removeDiacritics(statAway.players[i].player.firstName) + " " + utiles.removeDiacritics(statAway.players[i].player.lastName),
                                                team_abbreviation: utiles.checkTeam(event.team_id),
                                                opponent_id: event.opponent_id,
                                                position: statAway.players[i].player.position,
                                                seconds: miscellaneous.minSeconds,
                                                minutes: (miscellaneous.minSeconds === 0 ? 0 : (miscellaneous.minSeconds/60).toFixed(2)),
                                                points: offense.pts,
                                                assists: offense.ast,
                                                turnovers: defense.tov,
                                                steals: defense.stl,
                                                blocks: defense.blk,
                                                rebounds: rebounds.reb,
                                                field_goals_attempted: fieldGoals.fgAtt,
                                                field_goals_made: fieldGoals.fgMade,
                                                three_point_field_goals_attempted: fieldGoals.fg3PtAtt,
                                                three_point_field_goals_made: fieldGoals.fg3PtMade,
                                                free_throws_attempted: freeThrows.ftAtt,
                                                free_throws_made: freeThrows.ftMade,
                                                defensive_rebounds: rebounds.defReb,
                                                offensive_rebounds: rebounds.offReb,
                                                personal_fouls: miscellaneous.fouls,
                                                is_starter: ( miscellaneous.gamesStarted === 1 ? true: false),
                                                field_goal_percentage: fieldGoals.fgPct,
                                                three_point_percentage: fieldGoals.fg3PtPct,
                                                free_throw_percentage: freeThrows.ftPct,
                                                field_goal_percentage_string: fieldGoals.fgPct,
                                                three_point_field_goal_percentage_string: fieldGoals.fg3PtPct,
                                                free_throw_percentage_string: freeThrows.ftPct,
                                                event_id: event.event_id,
                                                event_start_date_time: event.event_start_date_time,
                                                event_season_type: event.event_season_type,
                                                team_event_location_type: 'a',
                                                team_event_result: resultAway,
                                                //team_event_number_in_season: event.team_event_number_in_season                                
                                            });
                
                                            //console.log(playerStatAway);
                                            console.log("Player Stats AWAY to Collection: "+playerStatAway.team_id +" player: "+playerStatAway.display_name  +" event: "+ playerStatAway.event_id);
                                            //utiles.sleepFor(1000);
                                            PlayerStat.collection.update({ player_id: playerStatAway.player_id, event_id: playerStatAway.event_id}, playerStatAway, {upsert:true}, function (err, docs) {
                                            //PlayerStat.collection.insertOne(playerStatAway, function (err, docs) {

                                                if (err){ 
                                                    console.warn("Duplicado");
                                                } else {
                                                    //console.log(docs);
                                                }
                                            });
                                        }
                                    } else if(event.team_event_location_type === 'h'){
                                        console.log(utiles.count(statHome.players));
                                        for(var j=0; j<utiles.count(statHome.players); j++){
                                            let playerStats = statHome.players[j].playerStats;
                                            let fieldGoals = playerStats[0].fieldGoals;
                                            let freeThrows= playerStats[0].freeThrows;
                                            let rebounds = playerStats[0].rebounds;
                                            let offense = playerStats[0].offense;
                                            let defense = playerStats[0].defense;
                                            let miscellaneous = playerStats[0].miscellaneous;
                    
                                            var playerStatHome = new PlayerStat({
                                                player_id: statHome.players[j].player.id,
                                                season_id: event.season_id, 
                                                team_id: event.team_id,
                                                last_name: utiles.removeDiacritics(statHome.players[j].player.lastName),
                                                first_name: utiles.removeDiacritics(statHome.players[j].player.firstName),
                                                display_name: utiles.removeDiacritics(statHome.players[j].player.firstName) + " " + utiles.removeDiacritics(statHome.players[j].player.lastName),
                                                team_abbreviation: utiles.checkTeam(event.team_id),
                                                opponent_id: event.opponent_id,
                                                position: statHome.players[j].player.position,
                                                seconds: miscellaneous.minSeconds,
                                                minutes: (miscellaneous.minSeconds === 0 ? 0 : (miscellaneous.minSeconds/60).toFixed(2)),
                                                points: offense.pts,
                                                assists: offense.ast,
                                                turnovers: defense.tov,
                                                steals: defense.stl,
                                                blocks: defense.blk,
                                                rebounds: rebounds.reb,
                                                field_goals_attempted: fieldGoals.fgAtt,
                                                field_goals_made: fieldGoals.fgMade,
                                                three_point_field_goals_attempted: fieldGoals.fg3PtAtt,
                                                three_point_field_goals_made: fieldGoals.fg3PtMade,
                                                free_throws_attempted: freeThrows.ftAtt,
                                                free_throws_made: freeThrows.ftMade,
                                                defensive_rebounds: rebounds.defReb,
                                                offensive_rebounds: rebounds.offReb,
                                                personal_fouls: miscellaneous.fouls,
                                                is_starter: ( miscellaneous.gamesStarted === 1 ? true: false),
                                                field_goal_percentage: fieldGoals.fgPct,
                                                three_point_percentage: fieldGoals.fg3PtPct,
                                                free_throw_percentage: freeThrows.ftPct,
                                                field_goal_percentage_string: fieldGoals.fgPct,
                                                three_point_field_goal_percentage_string: fieldGoals.fg3PtPct,
                                                free_throw_percentage_string: freeThrows.ftPct,
                                                event_id: event.event_id,
                                                event_start_date_time: event.event_start_date_time,
                                                event_season_type: event.event_season_type,
                                                team_event_location_type: 'h',
                                                team_event_result: resultHome,
                                                //team_event_number_in_season: event.team_event_number_in_season                                
                                            });
                    
                                            //console.log(playerStatHome);
                                            console.log("Player Stats HOME  to Collection: "+playerStatHome.team_id +" player: "+playerStatHome.display_name +" event: "+ playerStatHome.event_id);
                                            //utiles.sleepFor(1000);
                                            PlayerStat.collection.update({ player_id: playerStatHome.player_id, event_id: playerStatHome.event_id}, playerStatHome, {upsert:true}, function (err, docs) {
                                            //PlayerStat.collection.insertOne(playerStatHome, function (err, docs) {

                                                if (err){ 
                                                    console.warn("Duplicado");
                                                } else {
                                                    //console.log(docs);
                                                }
                                            });
                                        }
                
                                    }

                                } else {
                                    console.log(statsDats.game.playedStatus);

                                }
                        });
                        //});
                        
                    } else{
                        console.log("FILE NOT!!! existsSync");
                        msf.getData('nba', '2025-playoff', 'game_boxscore', 'json', {game: event.event_id,  force: 'true' })
                        .then( async response => {
                            await fs.readFile(jsonPath, (err, data) => {
                            //fs.readFile(jsonPath, (err, data) => {
            
                                if (err) throw err;
                                let statsDats = JSON.parse(data);

                                if(statsDats.game.playedStatus === "COMPLETED"){
                                    var statAway = statsDats.stats.away;
                                    var statHome = statsDats.stats.home;
                                    var resultAway='';
                                    var resultHome='';
                                    if (statsDats.scoring.homeScoreTotal < statsDats.scoring.awayScoreTotal){
                                        resultAway='win';
                                        resultHome='lose'
                                    }else if (statsDats.scoring.homeScoreTotal > statsDats.scoring.awayScoreTotal){
                                        resultAway='lose';
                                        resultHome='win'
                                    }
                                        
                                    if(event.team_event_location_type === 'a'){
                                        console.log(utiles.count(statAway.players));
                                        for(var i=0; i<utiles.count(statAway.players); i++){
                                            let playerStats = statAway.players[i].playerStats;
                                            let fieldGoals = playerStats[0].fieldGoals;
                                            let freeThrows= playerStats[0].freeThrows;
                                            let rebounds = playerStats[0].rebounds;
                                            let offense = playerStats[0].offense;
                                            let defense = playerStats[0].defense;
                                            let miscellaneous = playerStats[0].miscellaneous;
                
                                            var playerStatAway = new PlayerStat({
                                                player_id: statAway.players[i].player.id,
                                                season_id: event.season_id, 
                                                team_id: event.team_id,
                                                last_name: utiles.removeDiacritics(statAway.players[i].player.lastName),
                                                first_name: utiles.removeDiacritics(statAway.players[i].player.firstName),
                                                display_name: utiles.removeDiacritics(statAway.players[i].player.firstName) + " " + utiles.removeDiacritics(statAway.players[i].player.lastName),
                                                team_abbreviation: utiles.checkTeam(event.team_id),
                                                opponent_id: event.opponent_id,
                                                position: statAway.players[i].player.position,
                                                seconds: miscellaneous.minSeconds,
                                                minutes: (miscellaneous.minSeconds === 0 ? 0 : (miscellaneous.minSeconds/60).toFixed(2)),
                                                points: offense.pts,
                                                assists: offense.ast,
                                                turnovers: defense.tov,
                                                steals: defense.stl,
                                                blocks: defense.blk,
                                                rebounds: rebounds.reb,
                                                field_goals_attempted: fieldGoals.fgAtt,
                                                field_goals_made: fieldGoals.fgMade,
                                                three_point_field_goals_attempted: fieldGoals.fg3PtAtt,
                                                three_point_field_goals_made: fieldGoals.fg3PtMade,
                                                free_throws_attempted: freeThrows.ftAtt,
                                                free_throws_made: freeThrows.ftMade,
                                                defensive_rebounds: rebounds.defReb,
                                                offensive_rebounds: rebounds.offReb,
                                                personal_fouls: miscellaneous.fouls,
                                                is_starter: ( miscellaneous.gamesStarted === 1 ? true: false),
                                                field_goal_percentage: fieldGoals.fgPct,
                                                three_point_percentage: fieldGoals.fg3PtPct,
                                                free_throw_percentage: freeThrows.ftPct,
                                                field_goal_percentage_string: fieldGoals.fgPct,
                                                three_point_field_goal_percentage_string: fieldGoals.fg3PtPct,
                                                free_throw_percentage_string: freeThrows.ftPct,
                                                event_id: event.event_id,
                                                event_start_date_time: event.event_start_date_time,
                                                event_season_type: event.event_season_type,
                                                team_event_location_type: 'a',
                                                team_event_result: resultAway,
                                                team_event_number_in_season: event.team_event_number_in_season                                
                                            });
                
                                            //console.log(playerStatAway);
                                            console.log("Player Stats AWAY to Collection: "+playerStatAway.team_id +" player: "+playerStatAway.display_name  +" game: "+ playerStatAway.team_event_number_in_season +" event: "+ playerStatAway.event_id);
                                            //utiles.sleepFor(1000);
                                            PlayerStat.collection.update({ player_id: playerStatAway.player_id, event_id: playerStatAway.event_id}, playerStatAway, {upsert:true}, function (err, docs) {
                                                if (err){ 
                                                    console.warn("Duplicado");
                                                } else {
                                                    //console.log(docs);
                                                }
                                            });
                                        }
                                    } else if(event.team_event_location_type === 'h'){
                                        console.log(utiles.count(statHome.players));
                                        for(var j=0; j<utiles.count(statHome.players); j++){
                                            let playerStats = statHome.players[j].playerStats;
                                            let fieldGoals = playerStats[0].fieldGoals;
                                            let freeThrows= playerStats[0].freeThrows;
                                            let rebounds = playerStats[0].rebounds;
                                            let offense = playerStats[0].offense;
                                            let defense = playerStats[0].defense;
                                            let miscellaneous = playerStats[0].miscellaneous;
                    
                                            var playerStatHome = new PlayerStat({
                                                player_id: statHome.players[j].player.id,
                                                season_id: event.season_id, 
                                                team_id: event.team_id,
                                                last_name: utiles.removeDiacritics(statHome.players[j].player.lastName),
                                                first_name: utiles.removeDiacritics(statHome.players[j].player.firstName),
                                                display_name: utiles.removeDiacritics(statHome.players[j].player.firstName) + " " + utiles.removeDiacritics(statHome.players[j].player.lastName),
                                                team_abbreviation: utiles.checkTeam(event.team_id),
                                                opponent_id: event.opponent_id,
                                                position: statHome.players[j].player.position,
                                                seconds: miscellaneous.minSeconds,
                                                minutes: (miscellaneous.minSeconds === 0 ? 0 : (miscellaneous.minSeconds/60).toFixed(2)),
                                                points: offense.pts,
                                                assists: offense.ast,
                                                turnovers: defense.tov,
                                                steals: defense.stl,
                                                blocks: defense.blk,
                                                rebounds: rebounds.reb,
                                                field_goals_attempted: fieldGoals.fgAtt,
                                                field_goals_made: fieldGoals.fgMade,
                                                three_point_field_goals_attempted: fieldGoals.fg3PtAtt,
                                                three_point_field_goals_made: fieldGoals.fg3PtMade,
                                                free_throws_attempted: freeThrows.ftAtt,
                                                free_throws_made: freeThrows.ftMade,
                                                defensive_rebounds: rebounds.defReb,
                                                offensive_rebounds: rebounds.offReb,
                                                personal_fouls: miscellaneous.fouls,
                                                is_starter: ( miscellaneous.gamesStarted === 1 ? true: false),
                                                field_goal_percentage: fieldGoals.fgPct,
                                                three_point_percentage: fieldGoals.fg3PtPct,
                                                free_throw_percentage: freeThrows.ftPct,
                                                field_goal_percentage_string: fieldGoals.fgPct,
                                                three_point_field_goal_percentage_string: fieldGoals.fg3PtPct,
                                                free_throw_percentage_string: freeThrows.ftPct,
                                                event_id: event.event_id,
                                                event_start_date_time: event.event_start_date_time,
                                                event_season_type: event.event_season_type,
                                                team_event_location_type: 'h',
                                                team_event_result: resultHome,
                                                team_event_number_in_season: event.team_event_number_in_season                                
                                            });
                    
                                            //console.log(playerStatHome);
                                            console.log("Player Stats HOME  to Collection: "+playerStatHome.team_id +" player: "+playerStatHome.display_name +" game: "+ playerStatHome.team_event_number_in_season +" event: "+ playerStatHome.event_id);
                                            //utiles.sleepFor(1000);
                                            PlayerStat.collection.update({ player_id: playerStatHome.player_id, event_id: playerStatHome.event_id}, playerStatHome, {upsert:true}, function (err, docs) {
                                                if (err){ 
                                                    console.warn("Duplicado");
                                                } else {
                                                    //console.log(docs);
                                                }
                                            });
                                        }
                
                                    }

                                } else {
                                    console.log(statsDats.game.playedStatus);

                                }
                            });
                        });

                    }
                    
                }
                utiles.sleepFor(5000);	
                res.status(200).send({ code: 200, message: "Player Stats actualizadas en la BD - "+ eventID + "-"+eventLocation});

                        
            }
        }
            
    });    	
}

function updateReboundsLocal(req,res){

    const eventID = req.params.event;
    console.log(eventID);

    PlayerStat.find({
        event_id: eventID,
        season_id:"20_21", 
        event_season_type:"regular",
        team_event_location_type:"h"
    })
        .sort({ team_id: "asc" })
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador."});
                } else {
                    for(var i=0; i<playersStored.length; i++){
                       PlayerStat.update({_id: playersStored[i].id },  { $set: {
                                defensive_rebounds: playersStored[i].offensive_rebounds, 
                                offensive_rebounds: playersStored[i].defensive_rebounds, 
                            } }, (err, statUpdate) => {
                            if(err) {
                                err.status(500).send({ message: "Error del servidor."});
                            } else {
                                if(!statUpdate) {
                                    err.status(404).send({ message: "Jugador no encontrado."});
                                }
                            }
                        });
                        
                    }
                    res.status(200).send({ message: "Jugadores actualizados correctamente."});
                }
            }
        });
    
}

function checkPosition(position){
    let pos = "";
    switch(position) {
        case 'PG':
            pos = "G";
            break;
        case 'SG':
            pos = "G";
            break;
        case 'SF':
            pos = "F";
            break;
        case 'PF':
            pos = "F";
            break;
        case 'C':
            pos = "C";
            break;
        case 'G':
            pos = "G";
            break;
        case 'F':
            pos = "F";
            break;
        default:
            pos = "";
    };
    return pos;
  }

module.exports = {
    getTotalStatsByPlayer,
    getTotalStatsBySeasonPlayerApi,
    getStatsByPlayer,
    getStatsByPlayerAndMatch,
    getStatsByPlayerAndDate,
    updateStatDisplayName,
    getStatsData,
    getStatsBySeason,
    addStatsEventData,
    getStatsEventData,
    updateReboundsLocal,
    getStatsEventDataPlayoff,
    addStatsEventDataPlayoff
    
};