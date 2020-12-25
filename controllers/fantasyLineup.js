const FantasyLineup = require("../models/fantasyLineup");
const Registro = require("../models/registro");


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
                                    registro.usuario = fantasyUser 
                                    registro.mensaje = lineupData.player_name;

                                    registro.save((err, registroCreated) => {
                                        if(err){
                                            res.status(500).send({ message: "Error del servidor."});
                                        } else {
                                            if(!registroCreated) {
                                                res.status(404).send({ message: "Error al crear el registro."});
                                            } else {
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
        
    FantasyLineup.update({"_id": FantasyLineupId, "fantasyLineup._id": _id},
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
                        registro.tipo = "delete"; 
                        registro.usuario = fantasyUser 
                        registro.mensaje = fantasyPlayerName;

                        registro.save((err, registroCreated) => {
                            if(err){
                                res.status(500).send({ message: "Error del servidor."});
                            } else {
                                if(!registroCreated) {
                                    res.status(404).send({ message: "Error al crear el registro."});
                                } else {
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


module.exports = {
    addLineup,
    addPlayerLineup,
    getFantasyLineup,
    getFantasyLineupId,
    getFantasyLineupLimit,
    getUserFantasyLineup,
    updateFantasyLineup,
    deletePlayerFantasyLineup,
    getUsersFantasyLineups
};
