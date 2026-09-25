const FantasyPlayer = require("../models/fantasyPlayer");
const FantasyLineup = require("../models/fantasyLineup");
const Player = require("../models/player");
const utiles = require("../utils/normalizationNames");


function getFantasyPlayers(req,res){

    const seasonId = req.query.season;
    const leagueId = req.query.league;

    FantasyPlayer.find({ league_id: leagueId , season_id: seasonId , available: true })
        .sort({ last_name: "asc" })
        .exec((err, fantasyPlayer) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyPlayer || fantasyPlayer.length === 0) {
                    res.status(404).send({ code: 404, message: "No se han encontrado jugadores fantasy disponibles."});
                } else {
                    res.status(200).send({ code: 200, fantasyPlayer: fantasyPlayer });
                }
            }
        });

}

function getFantasyPlayer(req,res){

    const seasonId = req.query.season;
    const leagueId = req.query.league;
    const PlayerId = req.params.player;

    FantasyLineup.findOne({  league_id: leagueId , season_id: seasonId ,number_match: 0,
        "fantasyLineup.player_id":PlayerId}, { "name_team": 1, "_id": 0})
        .exec((err, fantasyLineup) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {

                    FantasyPlayer.findOne({ 
                        league_id: leagueId, 
                        season_id: seasonId, 
                        player_id: PlayerId 
                    })
                    .sort({ last_name: "asc" })
                    .exec((err, fantasyPlayer) => {
                        if (err) {
                            return res.status(500).send({ code: 500, message: "Error del servidor." });
                        }
                        
                        if (!fantasyPlayer) {
                            return res.status(404).send({ code: 404, message: "No se ha encontrado el jugador fantasy." });
                        }
                
                        // Añadir el name_team al objeto fantasyPlayer
                        fantasyLineup && fantasyLineup.name_team ? fantasyPlayer.name_team=fantasyLineup.name_team : fantasyPlayer.name_team="FA";
                
                        // Devolver la respuesta con el fantasyPlayer y el name_team añadido
                        return res.status(200).send({ 
                            code: 200, 
                            fantasyPlayer: fantasyPlayer 
                        });
                    });
            }
        });

    /*FantasyPlayer.findOne({ league_id: leagueId , season_id: seasonId , player_id: PlayerId })
        .sort({ last_name: "asc" })
        .exec((err, fantasyPlayer) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyPlayer || fantasyPlayer.length === 0) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado el jugador fantasy."});
                } else {
                    res.status(200).send({ code: 200, fantasyPlayer: fantasyPlayer });
                }
            }
        });*/

}

function activateFantasyPlayer(req, res){
    const { player_name, season_id, league_id, available } = req.body;

    FantasyPlayer.updateOne({ player_name: player_name, season_id: season_id, league_id: league_id}, 
        { available }, (err, fantasyStored) => {
        if(err) {
            res.status(500).send({ message: "Error del servidor."});
        } else {
            if(!fantasyStored) {
                res.status(404).send({ message: "Jugador Fantasy no encontrado."});
            } else {
                if(available === true) {
                    res.status(200).send({ message: "Jugador Fantasy activado correctamente."});
                } else {
                    res.status(200).send({ message: "Jugador Fantasy desactivado correctamente."});
                }
            }
        }
    } );
}

function addFantasyPlayers(req,res){
    Player.find({season_id: "26_27"})
    .sort({ team_id: "asc", last_name: "asc"})
    .exec((err, playersStored) => {
        if(err){
            res.status(500).send({ message: "Error del servidor."});
        } else {
            if(playersStored.length <= 0) {
                res.status(404).send({ message: "No se ha encontrado ningun jugador."});
            } else {
                console.log(playersStored.length);
                //for(var i=0; i<utiles.count(playersStored); i++){
                playersStored.forEach(async (registro) => {                 

                    //var fp = playersStored[i];
                    let fp =registro;
                    let fplayer = new FantasyPlayer({
                        player_id: fp.player_id,
                        player_name: utiles.removeDiacritics(fp.display_name),
                        season_id: "26_27",
                        league_id: "fa-league-25",
                        salary: 1,
                        cost: 1,
                        available: true,
                        position: fp.position,
                        avatar: fp.avatar
                    });
                    //console.log(fplayer);

                    //FantasyPlayer.collection.updateOne({player_id: fplayer.player_id, season_id: fplayer.season_id, league_id: fplayer.league_id}, fplayer, {upsert:true}, function (err, docs) {
                    FantasyPlayer.collection.insertOne(fplayer, function (err, docs) {

                        if (err){ 
                            //return console.error(err);
                            if (err){ 
                                //return console.error(err);
                                if (err.code === 11000) {
                                    // Código de error para duplicados
                                    console.warn("Duplicado: " + fplayer.player_name);
                                } else {
                                    console.error("Error al insertar registro: ", err);
                                }
                            }
                        } else {
                            console.log("Fantasy Player inserted to Collection: "+fplayer.player_name);
                        }
                    });
               // }
            });

            }
        }
    });

    res.status(200).jsonp({
        "status": 200,
        "message": `Fantasy Players inserted into Database`
      });	
}

function updateAvatarFantasyPlayer(req,res){
    Player.find({season_id: "26_27"})
    .sort({ team_id: "asc", last_name: "asc"})
    .exec((err, playersStored) => {
        if(err){
            res.status(500).send({ message: "Error del servidor."});
        } else {
            if(playersStored.length <= 0) {
                res.status(404).send({ message: "No se ha encontrado ningun jugador."});
            } else {
                for(var i=0; i<utiles.count(playersStored); i++){
                    var fp = playersStored[i];
                    var fplayer = new FantasyPlayer({
                        player_id: fp.player_id,
                        //player_name: utiles.removeDiacritics(fp.display_name),
                        season_id: "26_27",
                        league_id: "fa-league-25",
                        salary: 1,
                        cost: 1,
                        available: true,
                        position: fp.position,
                        avatar: fp.avatar
                    });
                    //console.log(fplayer);

                    FantasyPlayer.collection.updateOne({player_id: fplayer.player_id, season_id: fplayer.season_id, league_id: fplayer.league_id}, { $set: { avatar: fp.avatar }}, {upsert:false}, function (err, docs) {
                        if (err){ 
                            //return console.error(err);
                            console.warn("Duplicado");
                        } else {
                            //console.log("Fantasy Player inserted to Collection");
                        }
                    });
                }
            }
        }
    });

    res.status(200).send({ message: "Avatares  Fantasy actualizados correctamente."});

}

function isILFPlayer(req, res){
    const { id } = req.params;
    const { isIL } = req.body;

    FantasyPlayer.findByIdAndUpdate(id, { isIL}, (err, playerStored) => {
        if(err) {
            res.status(500).send({ message: "Error del servidor."});
        } else {
            if(!playerStored) {
                res.status(404).send({ message: "Jugador no encontrado."});
            } else {
                if(isIL === true) {
                    res.status(200).send({ message: "Jugador activado de la IL correctamente."});
                } else {
                    res.status(200).send({ message: "Jugador desactivado de la IL correctamente."});
                }
            }
        }
    } )
}

function getAllFantasyPlayers(req,res){

    const seasonId = req.query.season;
    const leagueId = req.query.league;

    FantasyPlayer.find({ league_id: leagueId , season_id: seasonId })
        .sort({ last_name: "asc" })
        .exec((err, fantasyPlayer) => {
            if(err){
                res.status(500).send({ code: 500, message: "Error del servidor."});
            } else {
                if(!fantasyPlayer || fantasyPlayer.length === 0) {
                    res.status(404).send({ code: 404, message: "No se han encontrado jugadores fantasy disponibles."});
                } else {
                    res.status(200).send({ code: 200, fantasyPlayer: fantasyPlayer });
                }
            }
        });

}


module.exports = {
    getFantasyPlayers,
    activateFantasyPlayer,
    addFantasyPlayers,
    updateAvatarFantasyPlayer,
    getFantasyPlayer,
    isILFPlayer,
    getAllFantasyPlayers
};