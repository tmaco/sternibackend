const FantasyLineup = require("../models/fantasyLineup");
const Registro = require("../models/registro");
const utiles = require("../utils/normalizationNames");
const FantasyCalendar = require("../models/fantasyCalendar");
const FantasyPlayer = require("../models/fantasyPlayer");



function addLineup(req,res){
    const body = req.body;   
    const lineup = new FantasyLineup(body);

    lineup.save((err, lineupStored) => {
        if(err) {
            res.status(400).send({code: 400, message: "El lineup que estás creando ya existe."})
        } else {
            if(!lineupStored){
                res.status(400).send({code: 400, message: "No se ha podido generar la lineup."})
            } else {
                res.status(200).send({code: 200, message: "Lineup creada correctamente."})
            }
        }
    });
}

function addPlayerLineup(req,res){
    let lineupData = req.body.fantasyPlayer.fantasyLineup;
    const {
        fantasyUser, seasonId, leagueId, available
    } = req.body;


    const params = req.params;

    FantasyLineup.findById({ _id: params.id })
        .exec((err, fantasyLimit) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {

                if(!fantasyLimit || fantasyLimit.length === 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado la alineación fantasy."});
                } else {
                    if(Object.keys(fantasyLimit.fantasyLineup).length  >= 12){
                        res.status(403).send({ code: 403, message: "Ya tiene 12 jugadores en su alineación."});
                    } else {

                        FantasyPlayer.findOne({ player_id: lineupData.player_id, season_id: seasonId, league_id: leagueId}, 
                            (err, fantasyPlayerStored) => {
                                if(err) {
                                res.status(500).send({ message: "Error del servidor."});
                            } else {
                                if(!fantasyPlayerStored){
                                    res.status(500).send({ code: 500, message: "Error del servidor."});
                                } else {
                                    if(fantasyPlayerStored.available === false){
                                        res.status(403).send({ code: 403, message: "El jugador ya no está disponible."});
                                    } else{
                                        FantasyLineup.findByIdAndUpdate({ _id: params.id }, { $push: { fantasyLineup: lineupData } })
                                        .exec((err, fantasyLineup) => {   
                                            if(err){
                                                res.status(500).send({ code: 500, message: "Error del servidor."});
                                            } else {
                                                if(!fantasyLineup) {
                                                    res.status(404).send({ code: 404, message: "No se ha encontrado la alineación fantasy."});
                                                } else {
                                                    FantasyPlayer.updateOne({ player_id: lineupData.player_id, season_id: seasonId, league_id: leagueId}, 
                                                        { available }, (err, fantasyStored) => {
                                                            if(err) {
                                                                res.status(500).send({ message: "Error del servidor."});
                                                            } else {
                                                                if(!fantasyStored) {
                                                                    res.status(404).send({ message: "Jugador Fantasy no encontrado."});
                                                                } else {
                                                                    const registro = new Registro();
                                                                    registro.tabla = "fantasyLineup";
                                                                    registro.tipo = "add"; 
                                                                    registro.fecha = Date.now();
                                                                    registro.usuario = fantasyUser 
                                                                    registro.mensaje = lineupData.position + " " + lineupData.player_name;
                                                                    registro.league = leagueId;           
                                                                    registro.player_id=lineupData.player_id,          
                                                                    registro.save((err, registroCreated) => {
                                                                        if(err){
                                                                            res.status(500).send({ code: 500, message: "Error del servidor."});
                                                                        } else {
                                                                            if(!registroCreated) {
                                                                                res.status(404).send({ code: 404, message: "Error al crear el registro."});
                                                                            } else {
                                                                                //utiles.sleepFor(2000);
                                                                                res.status(200).send({ code: 200, message: "Jugador añadido correctamente." });
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            }        
                                                        } );
                                                            
                                                }
                                            }
                                        })
                                    }
                                }
                            }

                        });

                        /*FantasyLineup.findByIdAndUpdate({ _id: params.id }, { $push: { fantasyLineup: lineupData } })
                        .exec((err, fantasyLineup) => {   
                            if(err){
                                res.status(500).send({ code: 500, message: "Error del servidor."});
                            } else {
                                if(!fantasyLineup) {
                                    res.status(404).send({ code: 404, message: "No se ha encontrado la alineación fantasy."});
                                } else {

                                    FantasyPlayer.updateOne({ player_id: lineupData.player_id, season_id: seasonId, league_id: leagueId}, 
                                        { available }, (err, fantasyStored) => {
                                            if(err) {
                                                res.status(500).send({ message: "Error del servidor."});
                                            } else {
                                                if(!fantasyStored) {
                                                    res.status(404).send({ message: "Jugador Fantasy no encontrado."});
                                                } else {
                                                    const registro = new Registro();
                                                    registro.tabla = "fantasyLineup";
                                                    registro.tipo = "add"; 
                                                    registro.fecha = Date.now();
                                                    registro.usuario = fantasyUser 
                                                    registro.mensaje = lineupData.position + " " + lineupData.player_name;
                                                    registro.league = leagueId;                     
                                                    registro.save((err, registroCreated) => {
                                                        if(err){
                                                            res.status(500).send({ code: 500, message: "Error del servidor."});
                                                        } else {
                                                            if(!registroCreated) {
                                                                res.status(404).send({ code: 404, message: "Error al crear el registro."});
                                                            } else {
                                                                //utiles.sleepFor(2000);
                                                                res.status(200).send({ code: 200, message: "Jugador añadido correctamente." });
                                                            }
                                                        }
                                                    });
                                                }
                                            }        
                                        } );
                                            
                                }
                            }
                        });*/
                    }
                }
            }
        });
}

function getFantasyLineup(req,res){
    FantasyLineup.find()
        .sort({ number_match: "asc"})
        .exec((err, fantasyLineup) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyLineup || fantasyLineup.length === 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado la fantasy lineup."});
                } else {
                    res.status(200).send({ code: 200, fantasyLineup: fantasyLineup });
                }
            }
        });

}

function getFantasyLineupId(req,res){

    const userId = req.query.user;
    const seasonId = req.query.season;
    const leagueId = req.query.league;

    FantasyLineup.findOne({ user_id: userId, league_id: leagueId , season_id: seasonId ,number_match: 0})
        .exec((err, fantasyLineup) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyLineup || fantasyLineup.length === 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado la fantasy lineup."});
                } else {
                    res.status(200).send({ code: 200, fantasyLineup: fantasyLineup });
                }
            }
        });

}

function getFantasyLeagueId(req,res){

    const userId = req.query.user;
    const seasonId = req.query.season;

    FantasyLineup.findOne({ user_id: userId, season_id: seasonId ,number_match: 0})
        .exec((err, fantasyLeague) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyLeague || fantasyLeague.length === 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado la fantasy league."});
                } else {
                    res.status(200).send({ code: 200, fantasyLeague: fantasyLeague.league_id });
                }
            }
        });

}

function getFantasyLineupLimit(req, res){
    const params = req.params;
    FantasyLineup.findById({ _id: params.id })
        .sort({ number_match: 0 })
        .exec((err, fantasyLineup) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyLineup || fantasyLineup.length === 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado la fantasy lineup."});
                } else {
                    res.status(200).send({ code: 200, numberPlayersFantayLineup: Object.keys(fantasyLineup.fantasyLineup).length });
                }
            }
        });

}

function getUserFantasyLineup(req,res){

    const userId = req.query.user;
    const seasonId = req.query.season;
    const leagueId = req.query.league;

    FantasyLineup.aggregate([{$match: { user_id: userId, league_id: leagueId , season_id: seasonId ,number_match: 0}},
        { $unwind: "$fantasyLineup" },
        { $sort: { "fantasyLineup.order": 1 } },
        { $group: { _id: "$_id", fantasyLineup: { $push: "$fantasyLineup" } } }])
        .exec((err, fantasyLineup) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyLineup || fantasyLineup.length === 0 || !fantasyLineup[0] ) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado fantasy lineup para " +userId +"."});
                } else {
                    res.status(200).send({ code: 200, fantasyLineup: fantasyLineup[0] });
                }
            }
        });
}

function getUserFantasyLineupMatch(req,res){

    const userId = req.query.user;
    const seasonId = req.query.season;
    const leagueId = req.query.league;
    const match = isNaN(req.query.match) ? req.query.match : parseInt(req.query.match, 10); // El segundo argumento es la base numérica

    FantasyLineup.aggregate([{$match: { user_id: userId, league_id: leagueId , season_id: seasonId ,number_match: match}},
        { $unwind: "$fantasyLineup" },
        { $sort: { "fantasyLineup.order": 1 } },
        { $group: { _id: "$_id", fantasyLineup: { $push: "$fantasyLineup" } } }])
        .exec((err, fantasyLineup) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyLineup || fantasyLineup.length === 0 || !fantasyLineup[0] ) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado fantasy lineup para " +userId +"."});
                } else {
                    res.status(200).send({ code: 200, fantasyLineup: fantasyLineup[0] });
                }
            }
        });
}

function updateFantasyLineup(req,res) {
    const FantasyLineupId = req.params.id;
    const {
        _id, order
    } = req.body;
        
    FantasyLineup.updateOne({"_id": FantasyLineupId, "fantasyLineup._id": _id},
    { $set: {"fantasyLineup.$.order": order }})
    .exec(
            (err, fantasyLineup) => {
                if(err){
                    res.status(500).send({ message: "Error del servidor."});
                } else {
                    if(!fantasyLineup) {
                        res.status(404).send({ message: "No se ha encontrado la fantasy lineup."});
                    } else {
                        res.status(200).send({ message: "Alineación actualizada correctamente." });
                    }
                }
            }
        );
}

function deletePlayerFantasyLineup(req, res) {
    const { id } = req.params;

    const {
        fantasyPlayerId, fantasyPlayerName, fantasyPlayer_id, fantasyUser, season_id, league_id, available, position
    } = req.body;


    FantasyLineup.updateOne( {_id: id}, { $pull: { fantasyLineup: { _id : [ fantasyPlayerId ] } } } )
    .exec(
            (err, fantasyLineup) => {
                if(err){
                    res.status(500).send({ message: "Error del servidor."});
                } else {
                    if(!fantasyLineup) {
                        res.status(404).send({ message: "No se ha encontrado la alineación fantasy."});
                    } else {

                        FantasyPlayer.updateOne({ player_id: fantasyPlayer_id, season_id: season_id, league_id: league_id}, 
                            { available }, (err, fantasyStored) => {
                            if(err) {
                                res.status(500).send({ message: "Error del servidor."});
                            } else {
                                if(!fantasyStored) {
                                    res.status(404).send({ message: "Jugador Fantasy no encontrado."});
                                } else {
                                    const registro = new Registro();
                                    registro.tabla = "fantasyLineup";
                                    registro.tipo = "drop"; 
                                    registro.fecha = Date.now();
                                    registro.usuario = fantasyUser; 
                                    registro.mensaje = position + " " + fantasyPlayerName;
                                    registro.league = league_id;   
                                    registro.player_id=fantasyPlayer_id,          
                                    registro.save((err, registroCreated) => {
                                        if(err){
                                            res.status(500).send({ code: 500, message: "Error del servidor."});
                                        } else {
                                            if(!registroCreated) {
                                                res.status(404).send({ code: 404, message: "Error al crear el registro."});
                                            } else {
                                                //utiles.sleepFor(2000);
                                                res.status(200).send({ code: 200, message: "Alineación actualizada correctamente." });
                                           }
                                        }
                                     });
                                }
                            }
                        } );
                    }
                }
            }
        );
}

function getUsersFantasyLineups(req,res){

    const seasonId = req.query.season;
    const leagueId = req.query.league;

    FantasyLineup.aggregate([{$match: { league_id: leagueId , season_id: seasonId ,number_match: 0}},
        { $unwind: "$fantasyLineup" },
        { $sort: { "fantasyLineup.order": 1 } },
        { $group: { _id: "$_id", playersList: { $push: { player_id: "$fantasyLineup.player_id", name_team : "$name_team", avatar: "$fantasyLineup.avatar" } } }}])
        .exec((err, fantasyLineup) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyLineup || fantasyLineup.length === 0 || !fantasyLineup[0] ) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado fantasy lineups."});
                } else {
                    res.status(200).send({ code: 200, fantasyLineup: fantasyLineup });
                }
            }
        });

}

function getScoringLineupUser(req,res){

    const seasonId = req.query.season;
    const leagueId = req.query.league;
    const numJornada = req.query.match;
    const userId = req.params.user;

    FantasyLineup.aggregate([{$match: { user_id: userId, league_id: leagueId , season_id: seasonId ,number_match: parseInt(numJornada)}},
        { $unwind: "$fantasyLineup" },
        { $sort: { "fantasyLineup.order": 1 } },
        { $group: { _id: "$_id", playersList: { $push: { player_id: "$fantasyLineup.player_id", player_name: "$fantasyLineup.player_name", name_team : "$name_team", 
        numMatches: "$fantasyLineup.numMatches",  fScoring: "$fantasyLineup.fScoring", minutes: "$fantasyLineup.minutes", position: "$fantasyLineup.position", order: "$fantasyLineup.order", avatar: "$fantasyLineup.avatar" } } }}])
        .exec((err, fantasyLineup) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyLineup || fantasyLineup.length === 0 || !fantasyLineup[0] || fantasyLineup[0].length === 0 ) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado fantasy lineups."});
                } else {
                    res.status(200).send({ code: 200, fantasyLineup: fantasyLineup[0] });
                }
            }
        });

}

function updateScoringLineupUser(req,res) {
    const FantasyLineupUser = req.params.user;
    const seasonID = req.query.season;
    const leagueID = req.query.league;
    const numMatch = req.query.match;
    const {
        player_id, fScoring, minutes
    } = req.body;
        
    FantasyLineup.updateOne({"user_id": FantasyLineupUser, "season_id": seasonID,"league_id": leagueID,
    "number_match": parseInt(numMatch), "fantasyLineup.player_id": parseInt(player_id)},
    { $inc: { "fantasyLineup.$.fScoring": parseFloat(fScoring),
            "fantasyLineup.$.minutes": parseFloat(minutes),
            "fantasyLineup.$.numMatches":1  
        } 
    })
    .exec(
            (err, fantasyLineup) => {
                if(err){
                    res.status(500).send({ code: 500, message: "Error del servidor."});
                } else {
                    if(!fantasyLineup) {
                        res.status(404).send({ code: 404, message: "No se ha encontrado la fantasy lineup."});
                    } else {
                        res.status(200).send({ code: 200, message: "Lineup actualizada correctamente." });
                    }
                }
            }
        );
}

function resetScoringLineupUser(req,res) {
    const FantasyLineupUser = req.params.user;
    const seasonID = req.query.season;
    const leagueID = req.query.league;
    const numMatch = req.query.match;
    const {
        player_id
    } = req.body;

    FantasyLineup.updateOne({"user_id": FantasyLineupUser, "season_id": seasonID,"league_id": leagueID,
    "number_match": parseInt(numMatch), "fantasyLineup.player_id": parseInt(player_id)},
    { $set: { "fantasyLineup.$.fScoring": 0,
            "fantasyLineup.$.minutes": 0,
            "fantasyLineup.$.numMatches": 0
        }
    })
    .exec(
            (err, fantasyLineup) => {
                if(err){
                    res.status(500).send({ code: 500, message: "Error del servidor."});
                } else {
                    if(!fantasyLineup) {
                        res.status(404).send({ code: 404, message: "No se ha encontrado la fantasy lineup."});
                    } else {
                        res.status(200).send({ code: 200, message: "Puntuacion Lineup reseteada correctamente." });
                    }
                }
            }
        );
}

/*function updateTotalScoringLineupUser(req,res) {
    const FantasyLineupId = req.params.id;
    const {
        fantasy_scoring, total_minutes, fantasy_scoring_prev, fantasy_scoringPG, fantasy_scoringSG, 
        fantasy_scoringSF, fantasy_scoringPF, fantasy_scoringC
    } = req.body;

        
    FantasyLineup.updateOne({"_id": FantasyLineupId},
    { $set: {"fantasy_scoring": fantasy_scoring, "total_minutes": total_minutes, "fantasy_scoring_prev": fantasy_scoring_prev,
    "fantasy_scoringPG": fantasy_scoringPG,  "fantasy_scoringSG": fantasy_scoringSG, "fantasy_scoringSF": fantasy_scoringSF, 
    "fantasy_scoringPF": fantasy_scoringPF, "fantasy_scoringC": fantasy_scoringC}})
    .exec(
            (err, fantasyLineup) => {
                if(err){
                    res.status(500).send({ code:500, message: "Error del servidor."});
                } else {
                    if(!fantasyLineup) {
                        res.status(404).send({ code:404, message: "No se ha encontrado la fantasy lineup."});
                    } else {
                        res.status(200).send({ code:200, message: "Fantasy Scoring actualizada correctamente." });
                    }
                }
            }
        );
}*/

function updateTotalScoringLineupUser(req,res) {
    const FantasyLineupId = req.params.id;
    const isPrev = req.query.prev;

    if(typeof(isPrev) !== "undefined" && isPrev === "false"){

        const {
            fantasy_scoring, total_minutes, fantasy_scoringG, fantasy_scoringF, fantasy_scoringC
        } = req.body;
    
            
        FantasyLineup.updateOne({"_id": FantasyLineupId},
        { $set: {"fantasy_scoring": fantasy_scoring, "total_minutes": total_minutes,
        "fantasy_scoringG": fantasy_scoringG, "fantasy_scoringF": fantasy_scoringF, "fantasy_scoringC": fantasy_scoringC}})
        .exec(
                (err, fantasyLineup) => {
                    if(err){
                        res.status(500).send({ code:500, message: "Error del servidor."});
                    } else {
                        if(!fantasyLineup) {
                            res.status(404).send({ code:404, message: "No se ha encontrado la fantasy lineup."});
                        } else {
                            res.status(200).send({ code:200, message: "Fantasy Scoring actualizada correctamente." });
                        }
                    }
                }
            );

    }else{
        const {
            fantasy_scoring, total_minutes, fantasy_scoring_prev, fantasy_scoringG, fantasy_scoringF, fantasy_scoringC
        } = req.body;
    
            
        FantasyLineup.updateOne({"_id": FantasyLineupId},
        { $set: {"fantasy_scoring": fantasy_scoring, "total_minutes": total_minutes, "fantasy_scoring_prev": fantasy_scoring_prev,
        "fantasy_scoringG": fantasy_scoringG, "fantasy_scoringF": fantasy_scoringF, "fantasy_scoringC": fantasy_scoringC}})
        .exec(
                (err, fantasyLineup) => {
                    if(err){
                        res.status(500).send({ code:500, message: "Error del servidor."});
                    } else {
                        if(!fantasyLineup) {
                            res.status(404).send({ code:404, message: "No se ha encontrado la fantasy lineup."});
                        } else {
                            res.status(200).send({ code:200, message: "Fantasy Scoring actualizada correctamente." });
                        }
                    }
                }
            );
    }

    
}

/*function getTotalScoringByJornada(req,res) {

    const seasonId = req.query.season;
    const leagueId = req.query.league;
    const numJornada = req.query.match;

    FantasyLineup.aggregate([{$match: { league_id: leagueId , season_id: seasonId ,number_match: parseInt(numJornada)}},
        { $group: { "_id" : { _id: "$_id", name_team: "$name_team" , user_id: "$user_id", fantasy_scoring:"$fantasy_scoring", total_minutes:"$total_minutes", fantasy_scoring_prev:"$fantasy_scoring_prev", puntos_fantasy:"$puntos_fantasy",
        fantasy_scoringPG: "$fantasy_scoringPG",  fantasy_scoringSG: "$fantasy_scoringSG",fantasy_scoringSF: "$fantasy_scoringSF", fantasy_scoringPF:"$fantasy_scoringPF", fantasy_scoringC:"$fantasy_scoringC"}}},
        { $sort: { "_id.fantasy_scoring": -1, "_id.total_minutes": 1, "_id.fantasy_scoringPG": -1 } }
    ])
        .exec((err, fantasyScoring) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyScoring || fantasyScoring.length === 0 ) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado fantasy lineups."});
                } else {
                    res.status(200).send({ code: 200, fantasyScoring: fantasyScoring });
                }
            }
        });
}*/

function getTotalScoringByJornada(req,res) {

    const seasonId = req.query.season;
    const leagueId = req.query.league;
    const numJornada = req.query.match;

    FantasyLineup.aggregate([{$match: { league_id: leagueId , season_id: seasonId ,number_match: parseInt(numJornada)}},
        { $group: { "_id" : { _id: "$_id", name_team: "$name_team" , user_id: "$user_id", fantasy_scoring:"$fantasy_scoring", total_minutes:"$total_minutes", fantasy_scoring_prev:"$fantasy_scoring_prev", position_prev:"$position_prev", puntos_fantasy:"$puntos_fantasy",
        fantasy_scoringG: "$fantasy_scoringG",fantasy_scoringF:"$fantasy_scoringF", fantasy_scoringC:"$fantasy_scoringC"}}},
        { $sort: { "_id.fantasy_scoring": -1, "_id.total_minutes": 1, "_id.fantasy_scoringG": -1 } }
    ])
        .exec((err, fantasyScoring) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyScoring || fantasyScoring.length === 0 ) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado fantasy lineups."});
                } else {
                    res.status(200).send({ code: 200, fantasyScoring: fantasyScoring });
                }
            }
        });
}

function getTotalScoringLineupByJornada(req,res) {

    const userId = req.params.user;

    const seasonId = req.query.season;
    const leagueId = req.query.league;
    const numMatch = req.query.match;

    FantasyLineup.findOne({ user_id: userId, league_id: leagueId , season_id: seasonId ,number_match: parseInt(numMatch)})
        .exec((err, fantasyLineup) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyLineup || fantasyLineup.length === 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado la fantasy lineup."});
                } else {
                    res.status(200).send({ code: 200, fantasyScoring: fantasyLineup.fantasy_scoring });
                }
            }
        });
}

function getPuntosLineupByJornada(req,res) {

    const userId = req.params.user;

    const seasonId = req.query.season;
    const leagueId = req.query.league;
    const numMatch = req.query.match;

    FantasyLineup.findOne({ user_id: userId, league_id: leagueId , season_id: seasonId ,number_match: parseInt(numMatch)})
        .exec((err, fantasyLineup) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyLineup || fantasyLineup.length === 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado la fantasy lineup."});
                } else {
                    res.status(200).send({ code: 200, puntosFantasy: fantasyLineup.puntos_fantasy });
                }
            }
        });
}


function getTotalScoringByLeague(req,res) {

    const seasonId = req.query.season;
    const leagueId = req.query.league;
    let limit = 17;
    let limit1 = 17;
    let limit2 = 17;

    if(seasonId==="20_21"){
        limit = 19;
    }else if(seasonId==="21_22"){
        limit = 19;
    }else if(seasonId==="22_23"){
        limit = 17;
    }else if(seasonId==="23_24"){
        limit = 17;
    }else if(seasonId==="24_25"){
        limit = 9;
        limit1 = 11;
        limit2 = 16;
    }


    FantasyLineup.aggregate([{$match: { league_id: leagueId , season_id: seasonId, $or: [
        { number_match: { $gt: 0, $lt: limit } },   // Rango del 1 al 8
        { number_match: { $gt: limit1, $lt: limit2 } }  // Rango del 12 al 15
    ]}},
        { $group: { "_id" : { name_team: "$name_team" , user_id: "$user_id"},
        "totalFScoring" : { "$sum": "$puntos_fantasy"},
        "totalScoring" : { "$sum": "$fantasy_scoring"}}},
        { $sort: { "totalFScoring": -1, "totalScoring": -1 } }
    ])
        .exec((err, fantasyScoring) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyScoring || fantasyScoring.length === 0 ) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado fantasy lineups."});
                } else {
                    res.status(200).send({ code: 200, fantasyScoring: fantasyScoring });
                }
            }
        });
}

function getTotalFantasyScoringByLeague(req,res) {

    const seasonId = req.query.season;
    const leagueId = req.query.league;
    let limit = 17;
    let limit1 = 17;
    let limit2 = 17;

    if(seasonId==="20_21"){
        limit = 19;
    }else if(seasonId==="21_22"){
        limit = 19;
    }else if(seasonId==="22_23"){
        limit = 17;
    }else if(seasonId==="23_24"){
        limit = 17;
    }else if(seasonId==="24_25"){
        limit = 9;
        limit1 = 11;
        limit2 = 16;
    }

    FantasyLineup.aggregate([{$match: { league_id: leagueId , season_id: seasonId, $or: [
        { number_match: { $gt: 0, $lt: limit } },   // Rango del 1 al 8
        { number_match: { $gt: limit1, $lt: limit2 } }  // Rango del 12 al 15
    ]}},
        { $group: { "_id" : { name_team: "$name_team" , user_id: "$user_id"},
        "totalFScoring" : { "$sum": "$fantasy_scoring"},
        "totalScoring" : { "$sum": "$puntos_fantasy"},

    }},
        { $sort: { "totalScoring": -1, "totalFScoring": -1,  } }
    ])
        .exec((err, fantasyScoring) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyScoring || fantasyScoring.length === 0 ) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado fantasy lineups."});
                } else {
                    res.status(200).send({ code: 200, fantasyScoring: fantasyScoring });
                }
            }
        });
}

function getTotalScoringGroupByJornadaPos(req,res) {

    const seasonId = req.query.season;
    const leagueId = req.query.league;

    FantasyLineup.aggregate([{$match: { league_id: leagueId , season_id: seasonId, number_match : {
        $gte: 1
    } }},
        { $group: { "_id" : { name_team: "$name_team" , user_id: "$user_id", number_match: "$number_match", fantasy_scoring:"$fantasy_scoring", total_minutes:"$total_minutes", fantasy_scoring_prev:"$fantasy_scoring_prev", position_prev:"$position_prev",puntos_fantasy:"$puntos_fantasy",
        fantasy_scoringPG: "$fantasy_scoringPG",  fantasy_scoringSG: "$fantasy_scoringSG",fantasy_scoringSF: "$fantasy_scoringSF", fantasy_scoringPF:"$fantasy_scoringPF", fantasy_scoringC:"$fantasy_scoringC"}}},
        { $sort: { "_id.number_match": 1, "_id.fantasy_scoring": -1,  } }
    ])
        .exec((err, fantasyScoring) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyScoring || fantasyScoring.length === 0 ) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado fantasy lineups."});
                } else {
                    res.status(200).send({ code: 200, fantasyScoring: fantasyScoring });
                }
            }
        });
}

function getTotalScoringGroupByJornada(req,res) {

    const seasonId = req.query.season;
    const leagueId = req.query.league;

    FantasyLineup.aggregate([{$match: { league_id: leagueId , season_id: seasonId, number_match : {
        $gte: 0
    } }},
        { $group: { "_id" : { name_team: "$name_team" , user_id: "$user_id", number_match: "$number_match", fantasy_scoring:"$fantasy_scoring", total_minutes:"$total_minutes", fantasy_scoring_prev:"$fantasy_scoring_prev", position_prev:"$position_prev",puntos_fantasy:"$puntos_fantasy",
        fantasy_scoringG: "$fantasy_scoringG",  fantasy_scoringF:"$fantasy_scoringF", fantasy_scoringC:"$fantasy_scoringC"}}},
        { $sort: { "_id.number_match": 1, "_id.fantasy_scoring": -1,  } }
    ])
        .exec((err, fantasyScoring) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyScoring || fantasyScoring.length === 0 ) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado fantasy lineups."});
                } else {
                    res.status(200).send({ code: 200, fantasyScoring: fantasyScoring });
                }
            }
        });
}

function updateScoringPointsByJornada(req,res) {
    const fantasyLineupId  = req.params.user;

    const {
        puntos_fantasy, position_prev
    } = req.body;
        
    FantasyLineup.updateOne({_id: fantasyLineupId},
    { $set: {"puntos_fantasy": puntos_fantasy, "position_prev": position_prev }})
    .exec(
            (err, fantasyLineup) => {
                if(err){
                    res.status(500).send({ message: "Error del servidor."});
                } else {
                    if(!fantasyLineup) {
                        res.status(404).send({ code: 404, message: "No se ha encontrado la fantasy lineup."});
                    } else {
                        res.status(200).send({ code: 200, message: "Puntuación actualizada correctamente." });
                    }
                }
            }
        );
}

function saveFantasyLineups(req,res){

    const seasonId = req.query.season;
    const leagueId = req.query.league;
    const match = req.query.match;


    FantasyLineup.find({season_id: seasonId, league_id: leagueId, number_match: 0})
        .exec((err, fantasyLineup) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyLineup || fantasyLineup.length === 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado las fantasy lineups."});
                } else {
                    fantasyLineup.map((item) =>{
                        var lineup = new FantasyLineup();
                        lineup.name_team = item.name_team;
                        lineup.user_id = item.user_id;; 
                        lineup.league_id = item.league_id; 
                        lineup.season_id = item.season_id;
                        lineup.number_match = match;         
                        lineup.fantasyLineup=item.fantasyLineup;  
                        lineup.save((err, lineupCreated) => {
                            if(err){
                                res.status(500).send({ code: 500, message: "Error del servidor."});
                            } else {
                                if(!lineupCreated) {
                                    res.status(404).send({ code: 404, message: "Error al crear la alineación."});
                                } 
                            }
                        });
                    });   
                    
                    res.status(200).send({ code: 200, message: "Alineaciones añadidas correctamente." });

                }
            }
        });

}

function updateFantasyTeamName(req, res) {
    const fantasyName = req.query.name;
    const seasonId = req.query.season;
    const leagueId = req.query.season;

    FantasyLineup.findByIdAndUpdate({_id: req.params.id, numer_match: 0, season_id: seasonId, league_id: leagueId}, {name_team: fantasyName}, (err, fantasyTeam) => {
        if(err) {
            err.status(500).send({ message: "Error del servidor."});
        } else {
            if(!fantasyTeam) {
                err.status(404).send({ message: "Usuario no encontrado."});
            } else {
                res.status(200).send({ code: 200, message: "Usuario actualizado correctamente."});
            }
        }
    });
}


module.exports = {
    addLineup,
    addPlayerLineup,
    getFantasyLineup,
    getFantasyLineupId,
    getFantasyLineupLimit,
    getUserFantasyLineup,
    getUserFantasyLineupMatch,
    updateFantasyLineup,
    deletePlayerFantasyLineup,
    getUsersFantasyLineups,
    getScoringLineupUser,
    updateScoringLineupUser,
    updateTotalScoringLineupUser,
    getTotalScoringByJornada,
    getTotalScoringLineupByJornada,
    getTotalScoringByLeague,
    getTotalScoringGroupByJornada,
    getFantasyLeagueId,
    getTotalFantasyScoringByLeague,
    updateScoringPointsByJornada,
    saveFantasyLineups,
    resetScoringLineupUser,
    getTotalScoringGroupByJornadaPos,
    updateFantasyTeamName,
    getPuntosLineupByJornada
};
