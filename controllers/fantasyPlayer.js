const FantasyPlayer = require("../models/fantasyPlayer");
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
    Player.find({season_id: "20_21"})
    .sort({ team_id: "asc", last_name: "asc"})
    .exec((err, playersStored) => {
        if(err){
            res.status(500).send({ message: "Error del servidor."});
        } else {
            if(playersStored.length <= 0) {
                res.status(404).send({ message: "No se ha encontrado ningun jugador."});
            } else {
                console.log(playersStored.length);
                for(var i=0; i<utiles.count(playersStored); i++){
                    var fp = playersStored[i];
                    var fplayer = new FantasyPlayer({
                        player_id: fp.player_id,
                        player_name: utiles.removeDiacritics(fp.display_name),
                        season_id: "20_21",
                        league_id: "4-mandos",
                        salary: 1,
                        cost: 1,
                        available: true,
                        position: fp.position,
                        avatar: fp.avatar
                    });
                    //console.log(fplayer);

                    FantasyPlayer.collection.updateOne({player_id: fplayer.player_id, season_id: fplayer.season_id, league_id: fplayer.league_id}, fplayer, {upsert:true}, function (err, docs) {
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

    res.status(200).jsonp({
        "status": 200,
        "message": `Fantasy Players inserted into Database`
      });	
}

function updateAvatarFantasyPlayer(req,res){
    Player.find({season_id: "20_21"})
    .sort({ team_id: "asc", last_name: "asc"})
    .exec((err, playersStored) => {
        if(err){
            res.status(500).send({ message: "Error del servidor."});
        } else {
            if(playersStored.length <= 0) {
                res.status(404).send({ message: "No se ha encontrado ningun jugador."});
            } else {
                console.log(playersStored.length);
                for(var i=0; i<utiles.count(playersStored); i++){
                    var fp = playersStored[i];
                    var fplayer = new FantasyPlayer({
                        player_id: fp.player_id,
                        player_name: utiles.removeDiacritics(fp.display_name),
                        season_id: "20_21",
                        league_id: "fa-league",
                        salary: 1,
                        cost: 1,
                        available: true,
                        position: fp.position,
                        avatar: fp.avatar
                    });
                    //console.log(fplayer);

                    FantasyPlayer.collection.updateOne({player_id: fplayer.player_id, season_id: fplayer.season_id, league_id: fplayer.league_id}, { $set: { avatar: fp.avatar }}, {upsert:true}, function (err, docs) {
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


module.exports = {
    getFantasyPlayers,
    activateFantasyPlayer,
    addFantasyPlayers,
    updateAvatarFantasyPlayer
};