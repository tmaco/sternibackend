//const { response } = require("express");
const utiles = require("../utils/normalizationNames");
const Player = require("../models/player");
const { log } = require("console");

function getPlayers(req,res) {
    Player.find({season_id: "23_24", roster_status: "active"})
        .sort({ team_id: "asc", last_name: "asc"})
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador."});
                } else {
                    res.status(200).send({ code: 200, players: playersStored });
                }
            }
        });
}

function getPlayersByTeam(req,res) {

    const TeamName = req.params.teamName;

    Player.find({ season_id: "23_24", team_id : TeamName, roster_status: "active"})
        .sort({ last_name: "asc"})
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador de " + TeamName + "."});
                } else {
                    res.status(200).send({ code: 200, players: playersStored });
                }
            }
        });
}

function getPlayersByPosition(req,res) {

    let position = [];

    switch(req.params.position) {
        case 'G':
            position = [ "PG", "SG" ];
            break;
        case 'F':
            position = [ "SF", "PF" ];
            break;
        case 'C':
            position = [ "C" ];
            break;
        default:
            position = [ "C" ];
    };

    Player.find({ season_id: "23_24", position : { $in: position }, roster_status: "active"})
        .sort({ last_name: "asc"})
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador con la posición " + position + "."});
                } else {
                    res.status(200).send({ code: 200, players: playersStored });
                }
            }
        });
}

function getPlayer(req,res){

    const playerName = req.params.playerName;

    Player.findOne({ season_id: "23_24", display_name : playerName})
        .exec((err, playerStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playerStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador llamado " + playerName + "."});
                } else {
                    res.status(200).send({ code: 200, player: playerStored });
                }
            }
        });

}

function getListPlayers(req,res){

    let players = req.params.playersName.split(',');

    Player.find({ season_id: "23_24", display_name : { $in: players }})
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador llamado " + players + "."});
                } else {
                    res.status(200).send({ code: 200, players: playersStored });
                }
            }
        });

}

function getPlayerId(req,res){

    const playerId = parseInt(req.params.playerId);

    Player.findOne({ season_id: "23_24", player_id : playerId})
        .exec((err, playerStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playerStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador con id " + playerId + "."});
                } else {
                    res.status(200).send({ code: 200, player: playerStored });
                }
            }
        });

}

function getPlayersData(req,res){
    console.log(req.params.team);
    var TeamName = req.params.team;
    let team_id = TeamName;

    var MySportsFeeds = require("mysportsfeeds-node");

    var msf = new MySportsFeeds("2.1", true);
    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");
    msf.getData('nba', '2023-2024-regular', 'players', 'json', {team: TeamName,  force: 'false' })
    .then(async response => {
        const fs = require('fs');
        var path = require('path');

        //var jsonPath = path.join(__dirname, '..', '.', 'results', 'players-nba-2023-2024-regular.json');
        var jsonPath = '/tmp/players-nba-2023-2024-regular.json';
        await fs.readFile(jsonPath, (err, data) => {
        if (err) throw err;
        let playersData = JSON.parse(data);

        team_id = utiles.checkNewAPISportsFeeds(TeamName);
        
        //res.status(200).send({ code: 200, data: playersData.players[0] });
        console.log(utiles.count(playersData.players));
            for(var i=0; i<utiles.count(playersData.players); i++){
                var ply = playersData.players[i].player;
                //console.log(ply.lastName);
                var player = new Player({
                    player_id: ply.id,
                    season_id: "23_24",
                    team_id: team_id,
                    last_name: utiles.removeDiacritics(ply.lastName), 
                    first_name: utiles.removeDiacritics(ply.firstName), 
                    display_name: utiles.removeDiacritics(ply.firstName) + " " +utiles.removeDiacritics(ply.lastName), 
                    birthdate: ply.birthDate,
                    age: ply.age, 
                    birthplace: ply.birthCity + ", " + ply.birthCountry,
                    height_formatted: ply.height,
                    weight_lb: ply.weight, 
                    weight_kg: ply.weight,
                    position: ply.primaryPosition, 
                    uniform_number: ply.jerseyNumber,
                    roster_status: ply.currentRosterStatus === "ROSTER" ? "active" : "inactive",
                    avatar: ply.officialImageSrc
                });

                //console.log(player);
                Player.collection.insertOne(player, function (err, docs) {
                //Player.collection.updateOne({ player_id: player.player_id, season_id: player.season_id}, player, {upsert:true}, function (err, docs) {
                    if (err){ 
                        //return console.error(err);
                        console.warn("Duplicado");
                    } else {
                        //console.log("Player inserted to Collection");
                    }
                });
            }
            /*player.save((err, playerStored) => {
                    if(err){
                        res.status(500).send({ message: "El usuario ya existe." });
                    } else {
                        if(!playerStored) {
                            res.status(500).send({ message: "Error al crear el nuevo jugador." });
                        } else {
                            res.status(200).send({ message: "Jugador creado correctamente."});
                        }
                    }
                })
        */
        });
    });

    res.status(200).jsonp({
        "status": 200,
        "message": `Team ${team_id} inserted into Database`
      });	
}

function updateDisplayName(req,res) {
    Player.find({season_id: "19_20"})
        .sort({ team_id: "asc", uniform_number: "asc"})
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador."});
                } else {
                    for(var i=0; i<playersStored.length; i++){
                        Player.findByIdAndUpdate({_id: playersStored[i].id }, { 
                            last_name: utiles.removeDiacritics(playersStored[i].last_name), 
                            first_name: utiles.removeDiacritics(playersStored[i].first_name), 
                            display_name: utiles.removeDiacritics(playersStored[i].display_name),
                            team_id: playersStored[i].team_id,
                            birthdate: playersStored[i].birthdate,
                            age: playersStored[i].age,
                            birthplace: playersStored[i].birthplace,
                            height_in: playersStored[i].height_in,
                            height_cm: playersStored[i].height_cm,
                            height_m: playersStored[i].height_m,
                            height_formatted : playersStored[i].height_formatted,
                            weight_lb: playersStored[i].weight_lb,
                            weight_kg: playersStored[i].weight_kg,
                            position: playersStored[i].position,
                            uniform_number: playersStored[i].uniform_number,
                            roster_status: playersStored[i].roster_status,
                            season_id: playersStored[i].season_id
                        }, (err, playerUpdate) => {
                            if(err) {
                                err.status(500).send({ message: "Error del servidor."});
                            } else {
                                if(!playerUpdate) {
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

function updateAvatar(req,res) {
    Player.find({season_id: "22_23"})
        .sort({ team_id: "asc", uniform_number: "asc"})
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador."});
                } else {
                    for(var i=0; i<playersStored.length; i++){
                        if(playersStored[i].avatar !== null){
                            Player.updateOne(
                                { player_id: playersStored[i].player_id, season_id: "23_24", avatar: null}, 
                                { avatar: playersStored[i].avatar }, 
                                { upsert: false }, 
                                (err, playerUpdate) => {
                                if(err) {
                                    err.status(500).send({ message: "Error del servidor."});
                                } else {
                                    if(!playerUpdate) {
                                        err.status(404).send({ message: "Jugador no encontrado."});
                                    } 
                                }
                            });
                        }                        
                    }
                    res.status(200).send({ message: "Jugadores actualizados correctamente."});
                }
            }
        });
    
}



module.exports = {
    getPlayers,
    getPlayersByTeam,
    getPlayer,
    getPlayerId,
    getPlayersData,
    updateDisplayName,
    getPlayersByPosition,
    getListPlayers,
    updateAvatar
};