const FantasyLineup = require("../models/fantasyLineup");
const Registro = require("../models/registro");
const utiles = require("../utils/normalizationNames");
const FantasyCalendar = require("../models/fantasyCalendar");



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
    let fantasyUser = req.body.fantasyUser
    const params = req.params;

    FantasyLineup.findById({ _id: params.id })
        .exec((err, fantasyLimit) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyLimit || fantasyLimit.length === 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado la fantasy lineup."});
                } else {
                    if(Object.keys(fantasyLimit.fantasyLineup).length  >= 12){
                        res.status(403).send({ code: 403, message: "Ya tiene 12 jugadores fanasy en su alineación."});
                    } else {

                        FantasyLineup.findByIdAndUpdate({ _id: params.id }, { $push: { fantasyLineup: lineupData } })
                        .exec((err, fantasyLineup) => {   
                            if(err){
                                res.status(500).send({ code: 500, message: "Error del servidor."});
                            } else {
                                if(!fantasyLineup) {
                                    res.status(404).send({ code: 404, message: "No se ha encontrado la fantasy lineup."});
                                } else {
                                    const registro = new Registro();
                                    registro.tabla = "fantasyLineup";
                                    registro.tipo = "add"; 
                                    registro.fecha = Date.now();
                                    registro.usuario = fantasyUser 
                                    registro.mensaje = lineupData.player_name;

                                    registro.save((err, registroCreated) => {
                                        if(err){
                                            res.status(500).send({ message: "Error del servidor."});
                                        } else {
                                            if(!registroCreated) {
                                                res.status(404).send({ message: "Error al crear el registro."});
                                            } else {
                                                utiles.sleepFor(2000);
                                                res.status(200).send({ code: 200, message: "Jugador añadido correctamente." });
                                            }
                                        }
                                    });
                                }
                            }
                        });
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
                        res.status(200).send({ message: "Lineup actualizada correctamente." });
                    }
                }
            }
        );
}

function deletePlayerFantasyLineup(req, res) {
    const { id } = req.params;

    const {
        fantasyPlayerId, fantasyPlayerName, fantasyUser
    } = req.body;

    FantasyLineup.updateOne( {_id: id}, { $pull: { fantasyLineup: { _id : [ fantasyPlayerId ] } } } )
    .exec(
            (err, fantasyLineup) => {
                if(err){
                    res.status(500).send({ message: "Error del servidor."});
                } else {
                    if(!fantasyLineup) {
                        res.status(404).send({ message: "No se ha encontrado la fantasy lineup."});
                    } else {
                        const registro = new Registro();
                        registro.tabla = "fantasyLineup";
                        registro.tipo = "drop"; 
                        registro.fecha = Date.now();
                        registro.usuario = fantasyUser; 
                        registro.mensaje = fantasyPlayerName;                        

                        registro.save((err, registroCreated) => {
                            if(err){
                                res.status(500).send({ message: "Error del servidor."});
                            } else {
                                if(!registroCreated) {
                                    res.status(404).send({ message: "Error al crear el registro."});
                                } else {
                                    utiles.sleepFor(2000);
                                    res.status(200).send({ message: "Lineup actualizada correctamente." });
                                }
                            }
                        });
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
        { $group: { _id: "$_id", playersList: { $push: { player_id: "$fantasyLineup.player_id", name_team : "$name_team" } } }}])
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
        numMatches: "$fantasyLineup.numMatches",  fScoring: "$fantasyLineup.fScoring", minutes: "$fantasyLineup.minutes", order: "$fantasyLineup.order", avatar: "$fantasyLineup.avatar" } } }}])
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

function updateTotalScoringLineupUser(req,res) {
    const FantasyLineupId = req.params.id;
    const {
        fantasy_scoring, total_minutes
    } = req.body;
        
    FantasyLineup.updateOne({"_id": FantasyLineupId},
    { $set: {"fantasy_scoring": fantasy_scoring, "total_minutes": total_minutes }})
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

function getTotalScoringByJornada(req,res) {

    const seasonId = req.query.season;
    const leagueId = req.query.league;
    const numJornada = req.query.match;

    FantasyLineup.aggregate([{$match: { league_id: leagueId , season_id: seasonId ,number_match: parseInt(numJornada)}},
        { $group: { "_id" : { name_team: "$name_team" , user_id: "$user_id", fantasy_scoring:"$fantasy_scoring", total_minutes:"$total_minutes"}}},
        { $sort: { "_id.fantasy_scoring": -1 } }
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

function getTotalScoringByLeague(req,res) {

    const seasonId = req.query.season;
    const leagueId = req.query.league;

    FantasyLineup.aggregate([{$match: { league_id: leagueId , season_id: seasonId, number_match : {
        $gte: 2
    }}},
        { $group: { "_id" : { name_team: "$name_team" , user_id: "$user_id"},
        "totalFScoring" : { "$sum": "$fantasy_scoring"}}},
        { $sort: { "totalFScoring": -1 } }
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
        $gte: 2
    } }},
        { $group: { "_id" : { name_team: "$name_team" , user_id: "$user_id", number_match: "$number_match", fantasy_scoring:"$fantasy_scoring", total_minutes:"$total_minutes"}}},
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


module.exports = {
    addLineup,
    addPlayerLineup,
    getFantasyLineup,
    getFantasyLineupId,
    getFantasyLineupLimit,
    getUserFantasyLineup,
    updateFantasyLineup,
    deletePlayerFantasyLineup,
    getUsersFantasyLineups,
    getScoringLineupUser,
    updateScoringLineupUser,
    updateTotalScoringLineupUser,
    getTotalScoringByJornada,
    getTotalScoringByLeague,
    getTotalScoringGroupByJornada
};
