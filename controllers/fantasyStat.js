const FantasyStat = require("../models/fantasyStat");
const utiles = require("../utils/normalizationNames");
const FantasyLeague = require("../models/fantasyLeague");
const PlayerStat = require("../models/playerStat");
const FantasyCalendar = require("../models/fantasyCalendar");



function getTotalFantasyStatsByPlayer(req,res){
    const playerName = req.params.playerName;


    FantasyStat.find({ player_name: playerName })
        .sort({ number_match: "asc"})
        .exec((err, statsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(statsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado estadisticas de " + playerName +"."});
                } else {
                    res.status(200).send({ code: 200, fantasy: statsStored });
                }
            }
        });

}

function getTotalFantasyStatsBySeasonPlayerApi(req,res){
    const playerName = req.params.playerName;
    const seasonId = req.query.season;


    FantasyStat.find({ season_id : seasonId, player_name: playerName,})
        .sort({ number_match: "asc"})
        .exec((err, statsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(statsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado estadisticas de " + playerName + " para la temporada " + seasonId+ "."});
                } else {
                    res.status(200).send({ code: 200, fantasy: statsStored });
                }
            }
        });

}

function getFantasyStatsByPlayer(req,res){
    const seasonId = req.query.season;
    const eventId = req.query.event;
    const playerName = req.params.playerName;


    FantasyStat.find({ season_id : seasonId, player_name: playerName, type_match: eventId})
        .sort({ number_match: "asc"})
        .exec((err, statsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(statsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado estadisticas de " + playerName 
                    + " del evento de tipo " + eventId + " para la temporada " + seasonId+ "."});
                } else {
                    res.status(200).send({ code: 200, fantasy: statsStored });
                }
            }
        });

}

function getFantasyStatsByLeague(req,res){
    const leagueId = req.query.fantasy;
    const seasonId = req.query.season;
    const eventId = req.query.event;
    const playerName = req.params.playerName;
    
    FantasyStat.find({ league_id : leagueId, season_id : seasonId, player_name: playerName, type_match: eventId})
        .sort({ number_match: "asc"})
        .exec((err, statsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(statsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado estadisticas dentro de la liga fantasy " + leagueId+ " para " + playerName 
                    + " del evento de tipo " + eventId + " para la temporada " + seasonId+ "."});
                } else {
                    res.status(200).send({ code: 200, fantasy: statsStored });
                }
            }
        });

}

function getFantasyStatsByPlayerAndMatch(req,res){
    const leagueId = req.query.fantasy;
    const seasonId = req.query.season;
    const eventId = req.query.event;
    const matchId = req.query.match;
    const playerName = req.params.playerName;

    FantasyStat.findOne({ league_id : leagueId, season_id : seasonId, player_name: playerName, type_match: eventId, 
        number_match: matchId})
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
                        res.status(200).send({ code: 200, fantasy: statsStored });
                    }
                }
                
            }
        });

}

function getFantasyStatsByPlayerAndDate(req,res){
    const leagueId = req.query.fantasy;
    const seasonId = req.query.season;
    const eventId = req.query.event;
    const matchId = req.query.match;
    const playerName = req.params.playerName;

    FantasyStat.findOne({ league_id : leagueId, season_id : seasonId, player_name: playerName, type_match: eventId, 
        date_match: matchId})
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
                        res.status(200).send({ code: 200, fantasy: statsStored });
                    }
                }
                
            }
        });

}

function updateFantasyDisplayName(req,res) {
    FantasyStat.find({season_id: "19_20"})
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador."});
                } else {
                    for(var i=0; i<playersStored.length; i++){
                        FantasyStat.updateMany({_id: playersStored[i].id },  { $set: {
                            player_name: utiles.removeDiacritics(playersStored[i].player_name),
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
        })
}

function calculateIsDoubleDouble(stat) {
	var isDoubleDouble = false;
	var counter = 0;
	
	if(stat.points >= 10)
		counter++;
	if(stat.rebounds >= 10)
		counter++;
	if(stat.assists >= 10)
		counter++;
	if(stat.steals >= 10)
		counter++;
	if(stat.blocks >= 10)	
		counter++;
	//console.log("calculateIsDoubleDouble: " +counter);
	
	if(counter >=2)
		isDoubleDouble = true;

	return isDoubleDouble;
}

function calculateIsTripleDouble(stat) {
	var isTripleDouble = false;
	var counter = 0;
	
	if(stat.points >= 10)
		counter++;
	if(stat.rebounds >= 10)
		counter++;
	if(stat.assists >= 10)
		counter++;
	if(stat.steals >= 10)
		counter++;
	if(stat.blocks >= 10)	
		counter++;
	//console.log("calculateIsTripleDouble: " +counter);

	
	if(counter >=3)
		isTripleDouble = true;

	return isTripleDouble;
}

function calculateScoring(stat, db, isDobleDoble, isTripleDoble) {
	var scoring = (db.scoring * stat.points) + (db.offensive_rebounds * stat.offensive_rebounds) + (db.defensive_rebounds * stat.defensive_rebounds) +
	(db.assisting * stat.assists) + (db.stealing * stat.steals) + (db.blocking * stat.blocks) + (db.turnovers * stat.turnovers) + 
	(db.personal_fouls * stat.personal_fouls) +
	(db.field_goals_attempted * stat.field_goals_attempted) +
	(db.field_goals_made * stat.field_goals_made) +
	(db.field_goals_missed * (stat.field_goals_attempted - stat.field_goals_made)) +
	(db.two_point_attempted * (stat.field_goals_attempted - stat.three_point_field_goals_attempted) ) +
	(db.two_point_made * (stat.field_goals_made - stat.three_point_field_goals_made)) +
	(db.two_point_missed * ((stat.field_goals_attempted - stat.three_point_field_goals_attempted)  - (stat.field_goals_made - stat.three_point_field_goals_made))) + 
	(db.three_point_attempted * stat.three_point_field_goals_attempted) + 
	(db.three_point_made * stat.three_point_field_goals_made) +
	(db.three_point_missed * (stat.three_point_field_goals_attempted - stat.three_point_field_goals_made))  +
	(db.free_throws_attempted * stat.free_throws_attempted) +
	(db.free_throws_made * stat.free_throws_made) +
	(db.free_throws_missed * (stat.free_throws_attempted - stat.free_throws_made));


	if(stat.team_event_result == 'win')
		scoring = scoring + db.is_winner;
						
	if(stat.team_event_result == 'lose')
		scoring = scoring + db.is_loser;
						
	if(stat.team_event_location_type == 'h')
		scoring = scoring + db.is_home;

	if(stat.team_event_location_type == 'a')
		scoring = scoring + db.is_away;

	if(stat.is_starter)
		scoring = scoring + db.is_starter;

	if(isDobleDoble)
		scoring = scoring + db.is_double_double;

	if(isTripleDoble)
		scoring = scoring + db.is_triple_double;
	
	return scoring;
}

function getFantasyStatsData(req,res){
    const seasonId = req.query.season;

    FantasyLeague.findOne({ league_id: req.params.league}, function (err, db) {
		if (err){ 
			return console.error(err);
		} else {
			if(db){
				//console.log(db);
                PlayerStat.find({"season_id": seasonId})
                .exec((err, data) => {
					//var stat;
					console.log(utiles.count(data));	
					for(var i=0; i<utiles.count(data); i++){
					//for(var i=0; i<1; i++){	
						var stat = data[i];
						//console.log(stat);
						var isDobleDoble = calculateIsDoubleDouble(stat);
						var isTripleDoble = calculateIsTripleDouble(stat);
						

						var scoring = calculateScoring(stat, db, isDobleDoble, isTripleDoble);
						
                        var ppm = 0;
                        
                        if(stat.minutes!==0)
                            ppm = scoring/stat.minutes;

						var fantasyStat = new FantasyStat({
                          season_id: seasonId,
                          league_id: req.params.league,
                          player_id: stat.player_id,
                          event_id: stat.event_id,
					      player_name: stat.display_name,
					      position: stat.position,
					      fantasy_scoring: ( scoring === 0 ? scoring : scoring.toFixed(2)),
					      minutes: stat.minutes,
					      points_per_minute: ( ppm === 0 ? ppm : ppm.toFixed(2)),
					      points: stat.points,
					      offensive_rebounds: stat.offensive_rebounds,
					      defensive_rebounds: stat.defensive_rebounds,
					      rebounds: stat.rebounds,
					      assists: stat.assists,
					      steals: stat.steals,
					      blocks: stat.blocks,
					      turnovers: stat.turnovers,
					      field_goals_attempted: stat.field_goals_attempted,
					      field_goals_made: stat.field_goals_made,
					      field_goals_missed: stat.field_goals_attempted - stat.field_goals_made, 
					      two_point_field_goals_attempted: stat.field_goals_attempted - stat.three_point_field_goals_attempted,
					      two_point_field_goals_made: stat.field_goals_made - stat.three_point_field_goals_made,
					      two_point_field_goals_missed: (stat.field_goals_attempted - stat.three_point_field_goals_attempted)  - (stat.field_goals_made - stat.three_point_field_goals_made),
					      three_point_field_goals_attempted: stat.three_point_field_goals_attempted,
					      three_point_field_goals_made: stat.three_point_field_goals_made,
					      three_point_field_goals_missed: stat.three_point_field_goals_attempted - stat.three_point_field_goals_made,
					      free_throws_attempted: stat.free_throws_attempted,
					      free_throws_made: stat.free_throws_made,
					      free_throws_missed: stat.free_throws_attempted - stat.free_throws_made,
					      personal_fouls: stat.personal_fouls,
					      is_starter: stat.is_starter,
					      is_double_double: isDobleDoble,
					      is_triple_double: isTripleDoble,
					      date_match: stat.event_start_date_time,
					      number_match: stat.team_event_number_in_season,
					      type_match: stat.event_season_type,
					      location_match: stat.team_event_location_type,
					      result_match: stat.team_event_result
                        });
                        
                    

						console.log("Fantasy Stats to League: "+fantasyStat.league_id +" player: "+fantasyStat.player_name +" Fantasy points: "+ fantasyStat.fantasy_scoring +" points per minute: "+ fantasyStat.points_per_minute +" Num match: "+ fantasyStat.number_match);
						//console.log(scoring);
						utiles.sleepFor(100);

						FantasyStat.collection.updateOne({ player_id: fantasyStat.player_id, event_id: fantasyStat.event_id, season_id: fantasyStat.season_id, league_id: fantasyStat.league_id}, fantasyStat, {upsert:true}, function (err, docs) {
						//FantasyStat.collection.insert(fantasyStat, function (err, docs) {
							if (err){ 
								//return console.error(err);
								console.warn("Duplicado");
							} else {
							    //console.log("Fantasy Stat inserted to Collection");
							    //console.log(docs);
							}
						});
					}
					
				});
				res.status(200).jsonp({
              		"status": 200,
              		"message": "Fantasy Stats " + req.params.league + " creada correctamente."
            	});	
			}else{
				res.status(404).jsonp({
				    "status": 404,
					"message": "Liga fantasy no encontrada."
				});
			}
					
		}
			
	});       
}

function addFantasyStatsDataEvent(req,res){
    const seasonId = req.query.season;
    const eventId = req.query.event;


    FantasyLeague.findOne({ league_id: req.params.league, season_id: seasonId}, function (err, db) {
		if (err){ 
			return console.error(err);
		} else {
			if(db){
				//console.log(db);
                PlayerStat.find({event_id: eventId})
                .exec((err, data) => {
					//var stat;
					console.log(utiles.count(data));	
					for(var i=0; i<utiles.count(data); i++){
					//for(var i=0; i<1; i++){	
						var stat = data[i];
						//console.log(stat);
						var isDobleDoble = calculateIsDoubleDouble(stat);
						var isTripleDoble = calculateIsTripleDouble(stat);
						

						var scoring = calculateScoring(stat, db, isDobleDoble, isTripleDoble);
						
                        var ppm = 0;
                        
                        if(stat.minutes!==0)
                            ppm = scoring/stat.minutes;

						var fantasyStat = new FantasyStat({
                          season_id: seasonId,
                          league_id: req.params.league,
                          player_id: stat.player_id,
                          event_id: stat.event_id,
					      player_name: stat.display_name,
					      position: stat.position,
					      fantasy_scoring: ( scoring === 0 ? scoring : scoring.toFixed(2)),
					      minutes: stat.minutes,
					      points_per_minute: ( ppm === 0 ? ppm : ppm.toFixed(2)),
					      points: stat.points,
					      offensive_rebounds: stat.offensive_rebounds,
					      defensive_rebounds: stat.defensive_rebounds,
					      rebounds: stat.rebounds,
					      assists: stat.assists,
					      steals: stat.steals,
					      blocks: stat.blocks,
					      turnovers: stat.turnovers,
					      field_goals_attempted: stat.field_goals_attempted,
					      field_goals_made: stat.field_goals_made,
					      field_goals_missed: stat.field_goals_attempted - stat.field_goals_made, 
					      two_point_field_goals_attempted: stat.field_goals_attempted - stat.three_point_field_goals_attempted,
					      two_point_field_goals_made: stat.field_goals_made - stat.three_point_field_goals_made,
					      two_point_field_goals_missed: (stat.field_goals_attempted - stat.three_point_field_goals_attempted)  - (stat.field_goals_made - stat.three_point_field_goals_made),
					      three_point_field_goals_attempted: stat.three_point_field_goals_attempted,
					      three_point_field_goals_made: stat.three_point_field_goals_made,
					      three_point_field_goals_missed: stat.three_point_field_goals_attempted - stat.three_point_field_goals_made,
					      free_throws_attempted: stat.free_throws_attempted,
					      free_throws_made: stat.free_throws_made,
					      free_throws_missed: stat.free_throws_attempted - stat.free_throws_made,
					      personal_fouls: stat.personal_fouls,
					      is_starter: stat.is_starter,
					      is_double_double: isDobleDoble,
					      is_triple_double: isTripleDoble,
					      date_match: stat.event_start_date_time,
					      number_match: stat.team_event_number_in_season,
					      type_match: stat.event_season_type,
					      location_match: stat.team_event_location_type,
					      result_match: stat.team_event_result
                        });
                        
                    

						console.log("Fantasy Stats to League: "+fantasyStat.league_id +" player: "+fantasyStat.player_name +" Fantasy points: "+ fantasyStat.fantasy_scoring +" points per minute: "+ fantasyStat.points_per_minute +" Num match: "+ fantasyStat.number_match);
						//console.log(scoring);
						utiles.sleepFor(100);

						FantasyStat.collection.updateOne({ player_id: fantasyStat.player_id, event_id: fantasyStat.event_id, season_id: fantasyStat.season_id, league_id: fantasyStat.league_id}, fantasyStat, {upsert:true}, function (err, docs) {
						//FantasyStat.collection.insert(fantasyStat, function (err, docs) {
							if (err){ 
								//return console.error(err);
								console.warn("Duplicado");
							} else {
							    //console.log("Fantasy Stat inserted to Collection");
							    //console.log(docs);
							}
						});
					}
					
                });
                res.status(200).send({ code: 200, message: "Fantasy Stats " + req.params.league + " creadas correctamente -" + eventId});	
			}else{
                res.status(404).send({ code: 404, message: "Liga fantasy no encontrada."});
			}		
		}
	});       
}

function getFantasyStatsBySeason(req,res){
	const leagueId = req.params.league;
	const seasonId = req.query.season;
	const eventID = req.query.event;


    FantasyStat.aggregate([{$match: { league_id: leagueId, season_id: seasonId, type_match: eventID, 
        minutes: { $gt: 0}
            }},
            { $group: { "_id": { player_id: "$player_id" , player_name: "$player_name" }, 
                "totalMatches" : { "$sum": 1},
                "totalMinutes" : { "$sum": "$minutes"},
                "totalFantasyScoring" : { "$sum": "$fantasy_scoring"},                           
            } },
            { $sort: { "totalFantasyScoring": -1 } },
        ])
        .exec((err, fstatsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(fstatsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado estadisticas fantasy de " + leagueId + " para la temporada " + seasonId +"."});
                } else {
                    res.status(200).send({ code: 200, fstats: fstatsStored });
                }
            }
        });
}

function getFantasyScoringByPlayer(req,res){
	const playerId = parseInt(req.params.player);
	const seasonId = req.query.season;
    const eventID = req.query.event;
    const leagueId = req.query.league;

    FantasyStat.aggregate([{$match: { league_id: leagueId, season_id: seasonId, type_match: eventID, 
        player_id: playerId, minutes: { $gt: 0}
            }},
            { $group: { "_id": { player_id: "$player_id" , player_name: "$player_name" }, 
                "totalMatches" : { "$sum": 1},
                "totalMinutes" : { "$sum": "$minutes"},
                "totalFantasyScoring" : { "$sum": "$fantasy_scoring"},                           
            } },
            { $sort: { "totalFantasyScoring": -1 } },
        ])
        .exec((err, fstatsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(fstatsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado estadisticas fantasy de " + playerId + " para la temporada " + seasonId +"."});
                } else {
                    res.status(200).send({ code: 200, fstats: fstatsStored[0] });
                }
            }
        });
}

function getFantasyScoringByEvent(req,res){

    const eventID = req.params.event;
    const leagueID = req.query.league;


    FantasyStat.aggregate([{$match: { event_id : eventID, league_id : leagueID,
        minutes: { $gt: 0}
            }},
            { $group: { "_id": { player_id: "$player_id" , player_name: "$player_name",league_id: "$league_id",
            fantasy_scoring: "$fantasy_scoring", minutes: "$minutes", points_per_minute: "$points_per_minute"        },                           
            } },
            { $sort: { fantasy_scoring: 1 } },
        ])
        .exec((err, fstatsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(fstatsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado estadisticas fantasy de " + leagueID + " para el evento " + eventID +"."});
                } else {
                    res.status(200).send({ code: 200, fstats: fstatsStored });
                }
            }
        });

         /*FantasyStat.find({ event_id : eventID})
        .exec((err, statsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(statsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado estadisticas del evento " + eventID+ "."});
                } else {
                    res.status(200).send({ code: 200, fantasy: statsStored });
                }
            }
        });*/

}

function getFantasyStatsByPlayerAndEventId(req,res){
    const leagueId = req.query.league;
    const seasonId = req.query.season;
    const eventId = req.query.event;
    const playerId = req.params.playerId;

    FantasyStat.findOne({ league_id : leagueId, season_id : seasonId, player_id: playerId, event_id: eventId})
        .exec((err, fstatsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if (!fstatsStored) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado estadisticas de " + 
                    playerId + " del partido " + eventId + " para la temporada " + seasonId+ "de la liga fantasy "+leagueId+ "."});
                } else {
                    if(fstatsStored.length <= 0) {
                        res.status(404).send({ code: 404, message: "No se ha encontrado estadisticas de " + 
                        playerId + " del partido " + eventId + " para la temporada " + seasonId+ "de la liga fantasy "+leagueId+ "."});
                    } else {
                        res.status(200).send({ code: 200, fantasy: fstatsStored });
                    }
                }
            }
        });

}

function getFantasyStatsPlayerByLeague(req,res){
    const leagueId = req.query.league;
    const seasonId = req.query.season;
    const typeId = req.query.type;
    const PlayerId = req.params.playerId;
    
    FantasyStat.find({ league_id : leagueId, season_id : seasonId, player_id: parseInt(PlayerId), type_match: typeId})
        .sort({ number_match: "asc"})
        .exec((err, statsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(statsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado estadisticas dentro de la liga fantasy " + leagueId+ " para " + PlayerId 
                    + " del evento de tipo " + typeId + " para la temporada " + seasonId+ "."});
                } else {
                    res.status(200).send({ code: 200, fantasy: statsStored });
                }
            }
        });

}

module.exports = {
    getTotalFantasyStatsByPlayer,
    getTotalFantasyStatsBySeasonPlayerApi,
    getFantasyStatsByPlayer,
    getFantasyStatsByLeague,
    getFantasyStatsByPlayerAndMatch,
    getFantasyStatsByPlayerAndDate,
	getFantasyStatsBySeason,
    updateFantasyDisplayName,
    getFantasyStatsData,
    getFantasyScoringByPlayer,
    getFantasyScoringByEvent,
    addFantasyStatsDataEvent,
    getFantasyStatsByPlayerAndEventId,
    getFantasyStatsPlayerByLeague
}